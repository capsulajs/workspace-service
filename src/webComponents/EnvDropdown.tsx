import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, from } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Dropdown } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';

const mountPoint = 'web-env-selector';

class EnvDropdown extends HTMLElement {
  public props$?: Observable<any>;

  constructor() {
    super();
    this.innerHTML = `<div id=${mountPoint}></div>`;
  }

  public connectedCallback() {
    const Component: any = this.props$ ? dataComponentHoc(Dropdown, this.props$) : Dropdown;
    ReactDOM.render(<Component />, document.getElementById(mountPoint));
  }
}

export default class CatalogWithData extends EnvDropdown {
  public setProps() {
    this.props$ = from(window.workspace.service({ serviceName: 'EnvSelectorService' })).pipe(
      map((serviceData) => serviceData.proxy),
      switchMap((envSelectorService) => {
        return envSelectorService.output$({}).pipe(
          map((envs: any[]) => envs.map((env) => ({ label: env.envKey }))),
          map((items) => ({
            title: 'Environments',
            items,
            onChange: ({ label }: { label: string }) => envSelectorService.select({ key: { envKey: label } }),
          }))
        );
      }),
      startWith({
        title: 'Environments',
        items: [],
        select: () => {},
      })
    );
  }
}
