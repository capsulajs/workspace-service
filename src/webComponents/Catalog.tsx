import ReactDOM from 'react-dom';
import React from 'react';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
// import { Catalog as CatalogComponent } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';

const UICatalog = (props) => {
    return (
      <div id="ui-catalog-component">
          {props.a}
      </div>
    )
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
        const ComponentWithData = dataComponentHoc(UICatalog, this.state$);
        ReactDOM.render(<ComponentWithData />, this.root.getElementById(mountPoint));
    }
}

// tslint:disable
export default class CatalogWithData extends Catalog {
    constructor(private services) {
        super();
    }

    public setState() {
        this.state$ = from(this.services.ParrotService.repeat('Hello Idan'))
          .pipe(
            map((data: any) => ({ a: data.response }))
          )
    }
}
