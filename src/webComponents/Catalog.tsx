import ReactDOM from 'react-dom';
import React from 'react';
import { Observable } from 'rxjs';
// import { Catalog as CatalogComponent } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';

const UICatalog = (props) => {
    return (
      <div id="ui-catalog-component">
          {props.a} / {props.b}
      </div>
    )
};

const mountPoint = 'uc-catalog';
const template = document.createElement('template');
template.innerHTML = `<div id="${mountPoint}"></div>`;

export default class Catalog extends HTMLElement {
    private root: any;
    private data$?: Observable<any>;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(template.content.cloneNode(true));
    }

    set data(data$) {
        console.log('setter for data', data$);
        this.data$ = data$;
    }

    public connectedCallback() {
        const ComponentWithData = dataComponentHoc(UICatalog, this.data$);
        ReactDOM.render(<ComponentWithData />, this.root.getElementById(mountPoint);
    }
}
