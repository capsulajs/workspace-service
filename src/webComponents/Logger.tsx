import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, of, from, combineLatest, merge } from 'rxjs';
import { map, merge, tap, switchMap, startWith } from 'rxjs/operators';
import { Logger } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';

interface LoggerProps {
  logs: Observable[];
}

class LoggerUI extends React.Component<LoggerProps> {
  public render() {
    return (<Logger logs={[]} width={300} height={400}/>);
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
      map((servicesData) => servicesData.map(serviceData => serviceData.proxy)),
      switchMap((services) => of({
        logs: services.map(service => service.output$({}))
      })),
      startWith({
        logs: [],
      })
    );
  }
}
