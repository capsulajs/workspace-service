
import { Workspace } from '../src/Workspace';
import { Microservices } from '@scalecube/scalecube-microservice';
import { ParrotService } from './__mocks__/services/ParrotService';

const config = {
  name: 'POC',
  services: [
    {
      serviceName: 'ParrotService',
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
    expect.assertions(3);

    (window as any)['workspace'] = new Workspace({ token: 'abc', config});
    const workspace = (window as any)['workspace'];

    await workspace.start().catch((e: any) => console.log(e));

    const parrotService = await workspace.service({ serviceName: 'ParrotService' });
    const greetingService = await workspace.service({ serviceName: 'GreetingService' });

    await expect(parrotService.proxy.repeat('Say heyyyy'))
      .resolves.toEqual({ response: 'Say heyyyy', token: 'abc' });

    await expect(greetingService.proxy.hello())
      .resolves.toEqual('Hello');

    await expect(greetingService.proxy.helloToParrot('Hey parrot'))
      .resolves.toEqual({ response: 'HelloHey parrot', token: 'abc' });
  });
});

