
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
          // console.log(path, module);
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
          // console.log(path, module);
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
          // console.log(path, module);
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
    expect.assertions(4);

    (window as any).workspace = new Workspace({ token: 'abc', config});
    const workspace = (window as any).workspace;

    await workspace.start().catch((e: any) => new Error(e));

    // const envRegistryService = (await workspace.service({ serviceName: 'EnvRegistryService' })).proxy;
    const envSelectorService = (await workspace.service({ serviceName: 'EnvSelectorService' })).proxy;
    const methodSelectorService = (await workspace.service({ serviceName: 'MethodSelectorService' })).proxy;

    // envRegistryService.environments$({}).subscribe({
    //   next: (env) => console.log(env),
    //   complete: () => done()
    // });

    const testEnvs = {
      develop: {
        envKey: 'develop',
        env: {
          services: [
            {
              serviceName: 'service1',
              url: 'http://accessPoint/dev/service1',
              methods: {
                myTestMethod1: {
                  asyncModel: 'RequestResponse'
                }
              }
            },
            {
              serviceName: 'service2',
              url: 'http://accessPoint/dev/service2',
              methods: {
                myTestMethod1: {
                  asyncModel: 'RequestResponse'
                },
                myTestMethod2: {
                  asyncModel: 'RequestStream'
                },
                myTestMethod3: {
                  asyncModel: 'RequestStream'
                }
              }
            }
          ]}
      },
      master: {
        envKey: 'master',
        env: {
          services: [
          {
            serviceName: 'service1',
            url: 'http://accessPoint/master/service1',
            methods: {
              myTestMethod1: {
                asyncModel: 'RequestResponse'
              }
            }
          },
          {
            serviceName: 'service2',
            url: 'http://accessPoint/master/service2',
            methods: {
              myTestMethod1: {
                asyncModel: 'RequestResponse'
              },
              myTestMethod2: {
                asyncModel: 'RequestStream'
              }
            }
          }
        ]
        }
      },
      'tag-1': {
        envKey: 'tag-1',
        env: {
          services: [
            {
              serviceName: 'service1',
              url: 'http://accessPoint/tag-1/service1',
              methods: {
                myTestMethod1: {
                  asyncModel: 'RequestResponse'
                }
              }
            },
            {
              serviceName: 'service2',
              url: 'http://accessPoint/tag-1/service2',
              methods: {
                myTestMethod1: {
                  asyncModel: 'RequestResponse'
                },
                myTestMethod2: {
                  asyncModel: 'RequestStream'
                }
              }
            }
          ]
        }
      },
      'tag-2': {
       envKey: 'tag-2',
       env: {
         services: [
           {
             serviceName: 'service1',
             url: 'http://accessPoint/tag-2/service1',
             methods: {
               myTestMethod1: {
                 asyncModel: 'RequestResponse'
               }
             }
           },
           {
             serviceName: 'service2',
             url: 'http://accessPoint/tag-2/service2',
             methods: {
               myTestMethod1: {
                 asyncModel: 'RequestResponse'
               },
               myTestMethod2: {
                 asyncModel: 'RequestStream'
               },
               myTestMethod42: {
                 asyncModel: 'RequestResponse'
               }
             }
           }
         ]
       }
      }
    };

    // envSelectorService.selected$({}).subscribe( (env) => {
    //     expect(env).toEqual(testEnvs['tag-1']);
    //   }
    // );

    const testMethods = {
      develop: [
        { serviceName: 'service1', methodName: 'myTestMethod1'},
        { serviceName: 'service2', methodName: 'myTestMethod1'},
        { serviceName: 'service2', methodName: 'myTestMethod2'},
        { serviceName: 'service2', methodName: 'myTestMethod3'},
      ],
      master: [
        { serviceName: 'service1', methodName: 'myTestMethod1'},
        { serviceName: 'service2', methodName: 'myTestMethod1'},
        { serviceName: 'service2', methodName: 'myTestMethod2'},
      ],
      'tag-1': [
        { serviceName: 'service1', methodName: 'myTestMethod1'},
        { serviceName: 'service2', methodName: 'myTestMethod1'},
        { serviceName: 'service2', methodName: 'myTestMethod2'}
      ],
      'tag-2': [
        { serviceName: 'service1', methodName: 'myTestMethod1'},
        { serviceName: 'service2', methodName: 'myTestMethod1'},
        { serviceName: 'service2', methodName: 'myTestMethod2'},
        { serviceName: 'service2', methodName: 'myTestMethod42'},
      ]
    };

    let counter = 0;
    methodSelectorService.output$({}).subscribe((item) => {
      switch (counter) {
        case 0: expect(item).toEqual([]);
          break;
        case 1: expect(item).toEqual(testMethods['tag-2']);
          break;
        case 2: expect(item).toEqual(testMethods.master);
          break;
        case 3: expect(item).toEqual(testMethods.develop);
          done();
          break;
      }
      counter = counter + 1;
    });

    await envSelectorService.select({ key: { envKey: 'tag-2' }});
    await envSelectorService.select({ key: { envKey: 'master' }});
    await envSelectorService.select({ key: { envKey: 'develop' }});


    // methodSelectorService.output$({}).subscribe({
    //   next: (method) => console.log,
    //   complete: () => done()
    // });
  });
});

