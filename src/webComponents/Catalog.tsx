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
template.innerHTML = `<div id="${mountPoint}"></div>`

export default class Catalog extends HTMLElement {
    // private config: any;
    private root: any;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(template.content.cloneNode(true));

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
        // console.log('ComponentWithData', ComponentWithData);
        ReactDOM.render(<ComponentWithData />, this.root.getElementById(mountPoint);
    }
}
