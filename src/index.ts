import '@babel/polyfill'
import { Workspace } from './Workspace';
import { Workspace as WorkspaceInterface } from './api/Workspace';
import { ParrotService } from './services/custom/ParrotService'
import { GreetingService } from './services/custom/GreetingService'

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
        return import(path).then((module: any) => {
          return new module.Selector();
        });
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
        return import(path).then((module: any) => {
          return new module.Selector();
        });
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
      path: '../src/_custom_node_modules_/environment-registry/lib',
      getInstance: (path: string, token: string) => {
        return import(path).then((module: any) => {
          return new module.EnvRegistry(token);
        });
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
  components: {
    componentsBeforeLoad: [
      {
        name: 'web-grid',
        nodeSelector: '#grid',
        path: '../../webComponents/Grid.tsx'
      }
    ],
    componentsAfterLoad: [
      {
        name: 'web-catalog',
        nodeSelector: '#grid #catalog',
        path: '../../webComponents/Catalog.tsx'
      }
    ]
  }
};

(window as any)['workspace'] = new Workspace({ token: 'abc', config});
const workspace = (window as any)['workspace'];

workspace.start();
