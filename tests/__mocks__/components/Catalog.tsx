import ReactDOM from 'react-dom';
import React from 'react';
import { Catalog as CatalogComponent } from '@capsulajs/capsulahub-ui';


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
        const props = {};
        ReactDOM.render(<CatalogComponent { ...props } />, mountPoint);
    }
}
