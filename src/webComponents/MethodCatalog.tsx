import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, from } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Catalog } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import { mapServiceMethods } from './helpers/mapServiceMethods';

const mountPoint = 'method-catalog';

class MethodCatalog extends HTMLElement {
  public props$?: Observable<any>;

  constructor() {
    super();
    this.innerHTML = `<div id=${mountPoint}></div>`;
  }

  public connectedCallback() {
    const Component: any = this.props$ ? dataComponentHoc(Catalog, this.props$) : Catalog;
    ReactDOM.render(<Component />, document.getElementById(mountPoint));
  }
}

export default class CatalogWithData extends MethodCatalog {
  public setProps() {
    this.props$ = from(window.workspace.service({ serviceName: 'MethodSelectorService' })).pipe(
      map((serviceData) => serviceData.proxy),
      switchMap((methodSelectorService) => {
        return methodSelectorService.output$({}).pipe(
          map((methods) => ({
            methods: mapServiceMethods(methods),
            selectMethod: (selectedMethod: any) => methodSelectorService.select({ key: selectedMethod }),
          }))
        );
      }),
      startWith({
        methods: [],
        selectedMethod: {},
        selectMethod: () => {},
      })
    );
  }
}
