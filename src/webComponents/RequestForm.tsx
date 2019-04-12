import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, from } from 'rxjs';
import { map, switchMap, startWith, tap } from 'rxjs/operators';
import { RequestForm as RequestFormUI } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';

const mountPoint = 'web-request-form';

class RequestForm extends HTMLElement {
  public props$?: Observable<any>;

  constructor() {
    super();
    this.innerHTML = `<div id=${mountPoint}></div>`;
  }

  public connectedCallback() {
    const Component: any = this.props$ ? dataComponentHoc(RequestFormUI, this.props$) : RequestFormUI;
    ReactDOM.render(<Component />, document.getElementById(mountPoint));
  }
}

export default class RequestFormWithData extends RequestForm {
  public setProps() {
    this.props$ = from(window.workspace.service({ serviceName: 'MethodSelectorService' })).pipe(
      map((serviceData) => serviceData.proxy),
      switchMap((methodSelectorService) => {
        return methodSelectorService.selected$({});
      }),
      tap((data) => console.log('data', data)),
      map((selectedMethod) => ({
        width: 300,
        height: 200,
        path: `${selectedMethod.serviceName}/${selectedMethod.methodName}`,
      }))
      // startWith({
      //   selectedMethod: {},
      // })
    );
  }
}
