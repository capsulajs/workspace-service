import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, combineLatest, from } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Dropdown } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';

interface EnvDropdownUIProps {
  items: any[];
  selected: any;
  select: (request: { key: { envKey: 'string' } }) => void;
}

class EnvDropdownUI extends React.Component<EnvDropdownUIProps> {
  public render() {
    const { items, selected } = this.props;

    return (
      <div>
        <Dropdown title="Environments" items={items} onChange={this.handleOnChange} />
        <p>OUTPUT:</p>
        {!selected.envKey && <p>No env has been selected</p>}
        {selected.envKey && (
          <div style={{ padding: 20 }}>
            <div>
              ENV[{selected.envKey}]: {JSON.stringify(selected.env || {})}
            </div>
          </div>
        )}
      </div>
    );
  }

  private handleOnChange = ({ label }) => {
    this.props.select({ key: { envKey: label } });
  };
}

const mountPoint = 'env-selector';

class EnvDropdown extends HTMLElement {
  public props$?: Observable<any>;

  constructor() {
    super();
    this.innerHTML = `<div id=${mountPoint}></div>`;
  }

  public connectedCallback() {
    const Component: any = this.props$ ? dataComponentHoc(EnvDropdownUI, this.props$) : EnvDropdownUI;
    ReactDOM.render(<Component />, document.getElementById(mountPoint));
  }
}

export default class CatalogWithData extends EnvDropdown {
  private setState() {
    this.props$ = from(window.workspace.service({ serviceName: 'EnvSelectorService' })).pipe(
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
