import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, combineLatest, from } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Dropdown } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import { Workspace as WorkspaceInterface } from '../api/Workspace';

declare global {
  interface Window {
    workspace: WorkspaceInterface;
  }
}

class UICatalog extends React.Component {

  private handleOnChange = ({ label }) => {
    this.props.select({ key: { envKey: label } });
  }

  render() {
    if (!this.props.items) {
      return <p>Loading...</p>
    }

    const { items, selected } = this.props;

    return (
      <div id="ui-catalog-component">
        <Dropdown title="Environments" items={items} onChange={this.handleOnChange}/>
        <p>OUTPUT:</p>
        {!selected.envKey && <p>No env has been selected</p>}
        {selected.envKey && (
          <div style={{padding: 20}}>
            <div>ENV[{selected.envKey}]: {JSON.stringify(selected.env || {})}</div>
          </div>
        )}
      </div>
    );
  }
}

const mountPoint = 'env-selector';

class Catalog extends HTMLElement {
  public props$?: Observable<any>;

  constructor() {
    super();
    this.innerHTML = `<div id=${mountPoint}></div>`;
  }

  public connectedCallback() {
    const Component = this.props$ ? dataComponentHoc(UICatalog, this.props$) : UICatalog;
    ReactDOM.render(<Component />, document.getElementById(mountPoint));
  }
}

export default class CatalogWithData extends Catalog {
  private setState() {
    const workspace = window.workspace;
    this.props$ = from(workspace.service({ serviceName: 'EnvSelectorService' })).pipe(
      map(serviceData => serviceData.proxy),
      switchMap((envSelectorService) => {
        return combineLatest(
          envSelectorService.output$({}).pipe(
            map((envs) => envs.map((env) => ({ label: env.envKey }))),
          ),
          envSelectorService.selected$({}),
        ).pipe(
          map((data) => ({ items: data[0], selected: data[1], select: envSelectorService.select }))
        )
      }),
      startWith({
        selected: {},
        items: [],
        select: () => {}
      })
    );
  }
}
