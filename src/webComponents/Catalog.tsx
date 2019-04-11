import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, combineLatest, from } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Dropdown, Catalog } from '@capsulajs/capsulahub-ui';
import * as a from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import { Workspace as WorkspaceInterface } from '../api/Workspace';
import styles from './styles.js';
import methods from './methodsMock.js';

declare global {
  interface Window {
    workspace: WorkspaceInterface;
  }
}

interface UIAppProps {
  items: any[];
  selected: any;
  select: (request: { key: { envKey: 'string' } }) => void;
}

class UIApp extends React.Component<UIAppProps> {
  public render() {
    const { items, selected } = this.props;

    return (
      <div id="ui-catalog-component" style={styles.root}>
        <div style={styles.column}>
          <Dropdown title="Environments" items={items} onChange={this.handleOnChange} />
          <p>OUTPUT:</p>
          {!selected.envKey && <p>No env has been selected</p>}
          {selected.envKey && (
            <div style={styles.output}>
              ENV[{selected.envKey}]: {JSON.stringify(selected.env || {})}
            </div>
          )}
        </div>
        <div style={styles.column}>
          <Catalog selectedMethod={methods[0].children[0]} methods={methods} selectMethod={console.log} />
        </div>
      </div>
    );
  }

  private handleOnChange = ({ label }) => {
    this.props.select({ key: { envKey: label } });
  };
}

const mountPoint = 'env-selector';

class App extends HTMLElement {
  public props$?: Observable<any>;

  constructor() {
    super();
    this.innerHTML = `<div id=${mountPoint}></div>`;
  }

  public connectedCallback() {
    const Component: any = this.props$ ? dataComponentHoc(UIApp, this.props$) : UIApp;
    ReactDOM.render(<Component />, document.getElementById(mountPoint));
  }
}

export default class AppWithData extends App {
  private setState() {
    const workspace = window.workspace;
    this.props$ = from(workspace.service({ serviceName: 'EnvSelectorService' })).pipe(
      map((serviceData) => serviceData.proxy),
      switchMap((envSelectorService) => {
        return combineLatest(
          envSelectorService.output$({}).pipe(map((envs: any[]) => envs.map((env) => ({ label: env.envKey })))),
          envSelectorService.selected$({})
        ).pipe(map((data) => ({ items: data[0], selected: data[1], select: envSelectorService.select })));
      }),
      startWith({
        selected: {},
        items: [],
        select: () => {},
      })
    );
  }
}
