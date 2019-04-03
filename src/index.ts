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
      serviceName: 'ParrotService',
      displayName: 'Parrot',
      path: './services/custom/ParrotService',
      getInstance: (path: string, token: string) => {
        return new Promise((resolve) => {
          resolve(new ParrotService(token));
        });
        // return import(path).then((module: any) => {
        //   return new module.ParrotService(token);
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
      path: './services/custom/GreetingService',
      getInstance: (path: string, token: string) => {
        return new Promise((resolve) => {
          resolve(new GreetingService());
        });
        // return import(path).then((module: any) => {
        //   return new module.GreetingService(token);
        // });
      },
      options: {
        definition: {
          serviceName: 'GreetingService',
          methods: {
            hello: { asyncModel: 'RequestResponse' },
            helloToParrot: { asyncModel: 'RequestResponse' },
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
