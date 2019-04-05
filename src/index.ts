import 'babel-polyfill';
// Use regular imports till dynamic imports issue is resolved
import { Workspace } from './Workspace';
import { Selector } from './services/custom/Selector'
import { EnvRegistry } from '@capsulajs/environment-registry'
import { envRegistry } from './envRegistry';

const token = 'localhost:1234';

localStorage.setItem(`${token}.environmentRegistry`, JSON.stringify(envRegistry));

const config = {
  name: 'POC',
  services: [
    {
      serviceName: 'EnvSelectorService',
      displayName: 'EnvSelector',
      path: '../src/services/custom/Selector',
      getInstance: (path: string) => {
        return Promise.resolve(new Selector());
        // return import(path).then((module: any) => {
        //   return new module.Selector();
        // });
      },
      options: {
        definition: {
          serviceName: 'EnvSelectorService',
          methods: {
            input: { asyncModel: 'RequestResponse' },
            output$: { asyncModel: 'RequestStream' },
            select: { asyncModel: 'RequestResponse' },
            selected$: { asyncModel: 'RequestStream' }
          },
        },
      },
    },
    {
      serviceName: 'MethodSelectorService',
      displayName: 'MethodSelector',
      path: '../src/services/custom/Selector',
      getInstance: (path: string) => {
        return Promise.resolve(new Selector());
        // return import(path).then((module: any) => {
        //   return new module.Selector();
        // });
      },
      options: {
        definition: {
          serviceName: 'MethodSelectorService',
          methods: {
            input: { asyncModel: 'RequestResponse' },
            output$: { asyncModel: 'RequestStream' },
            select: { asyncModel: 'RequestResponse' },
            selected$: { asyncModel: 'RequestStream' }
          },
        },
      },
    },
    {
      serviceName: 'EnvRegistryService',
      displayName: 'EnvRegistry',
      path: '@capsulajs/environment-registry',
      getInstance: (path: string, token: string) => {
        return Promise.resolve(new EnvRegistry(token));
        // return import(path).then((module: any) => {
        //   return new module.EnvRegistry(token);
        // });
      },
      options: {
        definition: {
          serviceName: 'EnvRegistryService',
          methods: {
            register: { asyncModel: 'RequestResponse' },
            environments$: { asyncModel: 'RequestStream' },
          },
        }
      },
    },
  ],
  components: [
    // {
    //   name: 'CatalogComponent',
    //   displayName: 'Catalog',
    //   path: '../src/services/custom/CatalogComponent',
    //   options: {
    //     import: (path: string) => {
    //       return import(path).then((module: any) => {
    //         return module.Catalog;
    //       })
    //     },
    //     render: (Component: any, props: any, domSelector: string) => {},
    //     definition: {
    //       name: 'CatalogComponent',
    //       props: {},
    //     },
    //   },
    // },
  ]
};

(window as any).workspace = new Workspace({ token, config });
const workspace = (window as any).workspace;

workspace.start().catch((e: any) => { throw new Error(e)});
