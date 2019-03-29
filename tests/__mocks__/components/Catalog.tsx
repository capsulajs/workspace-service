import ReactDOM from 'react-dom';
import React from 'react';
import { Catalog as CatalogComponent } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from '../../../src/dataComponentHoc';
import { from } from 'rxjs';


export class Catalog extends HTMLElement {
    private config: any;

    constructor() {
        super();
        // TODO this config should come from workspace
        this.config = {
            domSelector: '',
        }
    }
    public connectedCallback() {
        const mountPoint = document.querySelector(this.config.domSelector);
        this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

        ReactDOM.render(dataComponentHoc(CatalogComponent, from([1, 2, 3])), mountPoint);
    }
}
