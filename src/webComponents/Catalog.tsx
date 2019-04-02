import ReactDOM from 'react-dom';
import React from 'react';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
// import { Catalog as CatalogComponent } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import { createWebComponentWithData } from './helpers/createWebComponentWithData';

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
    private root: any;
    private data$?: Observable<any>;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(template.content.cloneNode(true));
    }

    set data(data$) {
        this.data$ = data$;
    }

    public connectedCallback() {
        const ComponentWithData = dataComponentHoc(UICatalog, this.data$);
        ReactDOM.render(<ComponentWithData />, this.root.getElementById(mountPoint);
    }
}

export default (services) => {
    const data$ = from(services.ParrotService.repeat('Hello Idan')).pipe(
      map((data: any) => ({ a: data.response }))
    );
    return createWebComponentWithData({ WebComponent: Catalog, data: data$ })
}
