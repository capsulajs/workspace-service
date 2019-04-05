import ReactDOM from 'react-dom';
import React from 'react';
// import { Catalog as CatalogComponent } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

const UICatalog = (props) => {
    return (
      <div id="ui-catalog-component">
          {props.a} / {props.b}
      </div>
    )
};

const mountPoint = 'uc-catalog';
const template = document.createElement('template');
const content = `<div id="${mountPoint}"></div>`;
template.innerHTML = content;

export default class Catalog extends HTMLElement {
    // private config: any;
    private root?: any;

    constructor() {
        super();
        if (this.attachShadow) {
            this.root = this.attachShadow({ mode: 'open' });
            this.root.appendChild(template.content.cloneNode(true));
        } else {
            this.innerHTML = content;
        }

        // TODO this config should come from workspace
        // this.config = {
        //     domSelector: '',
        // }
    }
    public connectedCallback() {
        const data$ = interval(1000)
          .pipe(
            map((n: number) => ({ a: `Hello ${n}`, b: `World ${n}` }))
          );
        const ComponentWithData = dataComponentHoc(UICatalog, data$);
        ReactDOM.render(<ComponentWithData />, (this.root || this).getElementById(mountPoint));
    }
}
