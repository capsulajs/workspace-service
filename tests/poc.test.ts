
import { Workspace } from '../src/Workspace';

const config = {
  name: 'POC',
  services: [
    {
      name: 'ParrotService',
      displayName: 'Parrot',
      path: 'services/ParrotService',
      getInstance: (path: string, token: string) => {
        return import(path).then((module: any) => {
          console.log(path, module);
          return new module.ParrotService(token);
        });
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
      path: 'services/GreetingService',
      getInstance: (path: string, token: string) => {
        return import(path).then((module: any) => {
          console.log(path, module);
          return new module.GreetingService(token);
        });
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
    {
      serviceName: 'SecretService',
      displayName: 'Secret',
      path: 'services/SecretService',
      getInstance: (path: string, token: string) => {
        return import(path).then((module: any) => {
          return new module.SecretService(token);
        });
      },
      options: {
        definition: {
          serviceName: 'SecretService',
          methods: {
            tellMeASecret: { asyncModel: 'RequestResponse' },
          },
        }
      },
    },
  ],
  components: [
    {
      name: 'CatalogComponent',
      displayName: 'Catalog',
      path: 'services/CatalogComponent',
      options: {
        import: (path: string) => {
          return import(path).then((module: any) => {
            return module.Catalog;
          })
        },
        render: (Component: any, props: any, domSelector: string) => {},
        definition: {
          name: 'CatalogComponent',
          props: {},
        },
      },
    },
  ]
};


describe('POC', () => {

  it('...', async () => {

    (window as any)['workspace'] = new Workspace({ token: 'abc', config});
    const workspace = (window as any)['workspace'];

    await workspace.start().catch((e: any) => console.log(e));

    // await workspace.register({
    //   serviceName: 'ParrotService',
    //   displayName: 'Parrot',
    // });
    //
    // const parrotService = workspace.service({ serviceName: 'ParrotService' });
    // console.log(parrotService.proxy);
    // console.log(workspace.internalSc);
    // return parrotService.proxy.repeat('Say heyyyy')
    //   .then((result: any)=> console.log(result))
    //   .catch((e: any)=> console.log(e));
  })
});

