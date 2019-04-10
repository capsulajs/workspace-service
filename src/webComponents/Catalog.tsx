import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, from, combineLatest } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Dropdown } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import { Workspace as WorkspaceInterface } from '../api/Workspace';

declare global {
  interface Window {
    workspace: WorkspaceInterface;
  }
}

class UICatalog extends React.Component {
  render() {
    const props = this.props;
    const items = Object.keys(props).map(label => ({ label }));

    return (
      <div id="ui-catalog-component">
        <Dropdown title="Environments" items={items} onChange={console.log}/>
        <p>OUTPUT:</p>
        <div>
          {Object.keys(props).map(key => (
            <div key={key} style={{padding: 20}}>
              <div>ENV[{key}]: {JSON.stringify(props[key], null, 4)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

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
  private async setState() {
    const workspace = window.workspace;
    const service = (await workspace.service({ serviceName: 'EnvSelectorService' })).proxy;
    this.state$ = service.output$({}).pipe(
      map((envs) => envs.reduce((acc, curr) => ({ ...acc, [curr.envKey]: curr.env.services }) ,{}))
    );
  }
}
