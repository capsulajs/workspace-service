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
      displayName: 'parrotService',
      path: '../src/services/custom/ParrotService',
      getInstance: (path: string) => {
        return Promise.resolve(new ParrotService(token));
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
      displayName: 'greetingService',
      path: '../src/services/custom/GreetingService',
      getInstance: (path: string) => {
        return Promise.resolve(new GreetingService());
      },
      options: {
        definition: {
          serviceName: 'GreetingService',
          methods: {
            hello: { asyncModel: 'RequestResponse' },
            helloToParrot: { asyncModel: 'RequestResponse' },
            helloToCount: { asyncModel: 'RequestStream' },
          },
        },
      },
    },
    {
      serviceName: 'EnvSelectorService',
      displayName: 'EnvSelector',
      path: '../src/services/custom/Selector',
      getInstance: (path: string) => {
        return Promise.resolve(new Selector());
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
