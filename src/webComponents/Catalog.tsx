import ReactDOM from 'react-dom';
import React from 'react';
// import { Catalog as CatalogComponent } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import { from } from 'rxjs';

const Hello = (props) => {
    console.log('props from ui-hello-component', props);
    return (
      <div id="ui-hello-component">
          Hello!
      </div>
    )
};

// export default class Catalog extends HTMLElement {
//     // private config: any;
//     private root: any;
//     private mountPoint: string;
//
//     constructor() {
//         super();
//         this.mountPoint = 'uc-catalog';
//         this.root = this.attachShadow({ mode: 'open' });
//         this.root.innerHTML = `<div id="{this.mountPoint}"></div>`;
//
//         // TODO this config should come from workspace
//         // this.config = {
//         //     domSelector: '',
//         // }
//     }
//     public connectedCallback() {
//         // const mountPoint = document.querySelector(this.config.domSelector);
//         // this.attachShadow({ mode: 'open' }).appendChild(mountPoint);
//
//         ReactDOM.render(dataComponentHoc(Hello, from([{ a: 'hello', b: 'world' }, { a: 'hello1', b: 'world2' }])), this.mountPoint);
//     }
// }

export default { test: 'test' };
