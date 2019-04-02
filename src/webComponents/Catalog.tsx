import ReactDOM from 'react-dom';
import React from 'react';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { dataComponentHoc } from './helpers/dataComponentHoc';

const UICatalog = (props) => {
  return (
    <div id="ui-catalog-component">
      {props.a}
    </div>
  );
};

const mountPoint = 'uc-catalog';
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
  constructor(private services) {
    super();
    this.setState();
  }

  private setState() {
    this.state$ = from(this.services.ParrotService.repeat('Hello Idan'))
      .pipe(
        map((data: any) => ({ a: data.response }))
      );
  }
}
