// Use regular imports until dynamic imports issue is resolved
import { Selector } from '../services/custom/Selector';
import { ParrotService } from '../services/custom/ParrotService';
import { GreetingService } from '../services/custom/GreetingService';
import { EnvRegistry } from '@capsulajs/environment-registry';
import { token } from '../const';

export const workspaceConfig = {
  name: 'POC',
  services: [
    {
      serviceName: 'ParrotService',
      displayName: 'Parrot',
      path: '../services/custom/ParrotService',
      getInstance: (path: string) => {
        return Promise.resolve(new ParrotService(token));
        // return import(path).then((module: any) => {
        //   return new module.Selector();
        // });
      },
      options: {
        definition: {
          serviceName: 'ParrotService',
          methods: {
            repeat: { asyncModel: 'RequestResponse' },
          },
        },
      },
    },
    {
      serviceName: 'GreetingService',
      displayName: 'Greeting',
      path: '../services/custom/GreetingService',
      getInstance: (path: string) => {
        return Promise.resolve(new GreetingService());
        // return import(path).then((module: any) => {
        //   return new module.Selector();
        // });
      },
      options: {
        definition: {
          serviceName: 'GreetingService',
          methods: {
            hello: { asyncModel: 'RequestResponse' },
            helloToParrot: { asyncModel: 'RequestResponse' }
          }
        },
      },
    },
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