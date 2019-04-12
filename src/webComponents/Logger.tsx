import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, of, from, combineLatest } from 'rxjs';
import { map, merge, tap, switchMap, startWith, distinctUntilChanged } from 'rxjs/operators';
import { Logger } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import { LoggerEvent } from '../types';
import { isEqual } from 'lodash';

interface LoggerProps {
  logs: Observable<LoggerEvent>[];
}

class LoggerUI extends React.Component<LoggerProps> {
  public render() {
    return <Logger logs={this.props.logs} width={600} height={400} />;
  }

  private handleOnChange = (selectedMethod) => this.setState({ selectedMethod });
}

const mountPoint = 'logger';

class Logs extends HTMLElement {
  public props$?: Observable<any>;

  constructor() {
    super();
    this.innerHTML = `<div id=${mountPoint}></div>`;
  }

  public connectedCallback() {
    const Component: any = this.props$ ? dataComponentHoc(LoggerUI, this.props$) : LoggerUI;
    ReactDOM.render(<Component />, document.getElementById(mountPoint));
  }
}

export default class LogsWithData extends Logs {
  public setProps() {
    this.props$ = combineLatest(
      from(window.workspace.service({ serviceName: 'EnvSelectorService' })),
      from(window.workspace.service({ serviceName: 'MethodSelectorService' }))
    ).pipe(
      map((servicesData) => servicesData.map((serviceData) => serviceData.proxy)),
      switchMap(([envSelectorService, methodSelectorService]) => {
        if (envSelectorService && methodSelectorService) {
          return of({
            logs: [
              envSelectorService.selected$({}).pipe(
                distinctUntilChanged(isEqual),
                map((response): LoggerEvent => ({
                  request: {},
                  response,
                  correlationId: 'EnvSelectorService',
                  type: 'response',
                  serviceName: 'EnvSelectorService',
                  methodName: 'selected$',
                  timestamp: new Date().getTime(),
                }))
              ),
              methodSelectorService.output$({}).pipe(
                distinctUntilChanged(isEqual),
                map((response): LoggerEvent => ({
                  request: {},
                  response,
                  correlationId: 'MethodSelectorService',
                  type: 'response',
                  serviceName: 'MethodSelectorService',
                  methodName: 'output$',
                  timestamp: new Date().getTime(),
                }))
              ),
            ],
          });
        }

        return of({ logs: [] });
      })
    );
  }
}
