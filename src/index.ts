import '@babel/polyfill';
import { Workspace } from './Workspace';
import { Workspace as WorkspaceInterface } from './api/Workspace';
import { envRegistry } from './mocks/envRegistry';
import { token } from './const';
import { Selector } from './services/custom/Selector';
import { EnvRegistry } from '@capsulajs/environment-registry';

declare global {
  interface Window {
    workspace: WorkspaceInterface;
  }
}
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
            selected$: { asyncModel: 'RequestStream' },
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
            selected$: { asyncModel: 'RequestStream' },
          },
        },
      },
    },
    {
      serviceName: 'EnvRegistryService',
      displayName: 'EnvRegistry',
      path: '../src/_custom_node_modules_/environment-registry/lib',
      getInstance: (path: string, instanceToken: string) => {
        return Promise.resolve(new EnvRegistry(instanceToken));
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
        },
      },
    },
  ],
  components: {
    componentsBeforeLoad: [
      {
        name: 'web-grid',
        nodeSelector: '#grid',
        path: '../../webComponents/Grid.tsx',
      },
    ],
    componentsAfterLoad: [
      {
        name: 'web-catalog',
        nodeSelector: '#grid #catalog',
        path: '../../webComponents/Catalog.tsx',
      },
    ],
  },
};

localStorage.setItem(`${token}.environmentRegistry`, JSON.stringify(envRegistry));

(window as any).workspace = new Workspace({ token, config });
const workspace = (window as any).workspace;

workspace
  .start({ token })
  .then(() => {
    workspace
      .services({})
      .then((data) => console.log('data', data))
      .catch((error) => console.log('error', error));
  })
  .catch((error) => {
    throw new Error(error);
  });
