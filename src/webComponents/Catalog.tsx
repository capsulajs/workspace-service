import ReactDOM from 'react-dom';
import React from 'react';
// import { Catalog as CatalogComponent } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import WebComponentWithData from './helpers/WebComponentWithData';

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

class Catalog extends WebComponentWithData {
    private root: any;

    constructor(servises) {
        super(servises);
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(template.content.cloneNode(true));
    }

    public connectedCallback() {
        const ComponentWithData = dataComponentHoc(UICatalog, this.state$);
        ReactDOM.render(<ComponentWithData />, this.root.getElementById(mountPoint);
    }
}


// export default (services) => {
//     const data$ = from(services.ParrotService.repeat('Hello Idan')).pipe(
//       map((data: any) => ({ a: data.response }))
//     );
//     return createWebComponentWithData({ WebComponent: Catalog, data: data$ })
// }
