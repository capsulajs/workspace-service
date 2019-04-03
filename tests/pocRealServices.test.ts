
import { Workspace } from '../src/Workspace';

const config = {
  name: 'POC',
  services: [
    {
      serviceName: 'EnvSelectorService',
      displayName: 'EnvSelector',
      path: '../src/services/custom/Selector',
      getInstance: (path: string) => {
        return import(path).then((module: any) => {
          console.log(path, module);
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
          console.log(path, module);
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
          console.log(path, module);
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


describe('POC', () => {

  it('...', async (done) => {
    expect.assertions(3);

    (window as any)['workspace'] = new Workspace({ token: 'abc', config});
    const workspace = (window as any)['workspace'];

    await workspace.start().catch((e: any) => console.log(e));

    const envRegistryService = (await workspace.service({ serviceName: 'EnvRegistryService' })).proxy;
    const envSelectorService = (await workspace.service({ serviceName: 'EnvSelectorService' })).proxy;
    const methodSelectorService = (await workspace.service({ serviceName: 'MethodSelectorService' })).proxy;

    // const mockedEnv = {
    //   services: [
    //     {
    //       serviceName: 'service1',
    //       url: 'http://accessPoint/dev/service1',
    //       methods: {
    //         myTestMethod1: { asyncModel: 'RequestResponse' },
    //       },
    //     },
    //     {
    //       serviceName: 'service2',
    //       url: 'http://accessPoint/dev/service2',
    //       methods: {
    //         myTestMethod1: { asyncModel: 'RequestResponse' },
    //         myTestMethod2: { asyncModel: 'RequestStream' },
    //         myTestMethod3: { asyncModel: 'RequestStream' },
    //       },
    //     },
    //   ]};

    envRegistryService.environments$({}).subscribe({
      next: (env) => console.log(env),
      complete: () => done()
    });
    // const parrotService = await workspace.service({ serviceName: 'ParrotService' });
    // const greetingService = await workspace.service({ serviceName: 'GreetingService' });
    //
    // await expect(parrotService.proxy.repeat('Say heyyyy'))
    //   .resolves.toEqual({ response: 'Say heyyyy', token: 'abc' });
    //
    // await expect(greetingService.proxy.hello())
    //   .resolves.toEqual('Hello');
    //
    // await expect(greetingService.proxy.helloToParrot('Hey parrot'))
    //   .resolves.toEqual({ response: 'HelloHey parrot', token: 'abc' });
  });
});

