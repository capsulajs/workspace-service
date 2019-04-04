import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, from, combineLatest } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import { Workspace as WorkspaceInterface } from '../api/Workspace';

declare global {
  interface Window {
    workspace: WorkspaceInterface;
  }
}

const UICatalog = (props) => {
  return (
    <div id="ui-catalog-component">
      <p>Parrot: {props.parrot}</p>
      <p>Greeting: {props.greeting}</p>
    </div>
  );
};

const mountPoint = 'react-catalog';
const template = document.createElement('template');
template.innerHTML = `<div id="${mountPoint}"></div>`;

class Catalog extends HTMLElement {
  public state$?: Observable<any>;
  private root: any;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));
  }

  public connectedCallback() {
    const Component = this.state$ ? dataComponentHoc(UICatalog, this.state$) : UICatalog;
    ReactDOM.render(<Component />, this.root.getElementById(mountPoint));
  }
}

export default class CatalogWithData extends Catalog {
  private setState() {
    const workspace = window.workspace;
    const parrotService$ = from(workspace.service({ serviceName: 'ParrotService' }));
    const greetingService$ = from(workspace.service({ serviceName: 'GreetingService' }));

    this.state$ = combineLatest(
      parrotService$,
      greetingService$
    ).pipe(
      mergeMap((services: Array<any>) => combineLatest(
        from(services[0].proxy.repeat('Hello Parrot')),
        services[1].proxy.helloToCount('Stephane'),
      )),
      map((responses) => ({
        parrot: (responses[0] as any).response,
        greeting: responses[1],
      }))
    );
  }
}
