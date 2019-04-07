import { Workspace } from '../src/Workspace';

// const config = {
//   name: 'POC',
//   services: [
//     {
//       serviceName: 'ParrotService',
//       displayName: 'Parrot',
//       path: '../src/services/custom/ParrotService',
//       getInstance: (path: string, token: string) => {
//         return import(path).then((module: any) => {
//           console.log(path, module);
//           return new module.ParrotService(token);
//         });
//       },
//       options: {
//         definition: {
//             serviceName: 'ParrotService',
//             methods: {
//               repeat: { asyncModel: 'RequestResponse' },
//             },
//         },
//       },
//     },
//     {
//       serviceName: 'GreetingService',
//       displayName: 'Greeting',
//       path: '../src/services/custom/GreetingService',
//       getInstance: (path: string, token: string) => {
//         return import(path).then((module: any) => {
//           console.log(path, module);
//           return new module.GreetingService(token);
//         });
//       },
//       options: {
//         definition: {
//           serviceName: 'GreetingService',
//           methods: {
//             hello: { asyncModel: 'RequestResponse' },
//             helloToParrot: { asyncModel: 'RequestResponse' },
//           },
//         }
//       },
//     },
//   ],
//   components: [
//     // {
//     //   name: 'CatalogComponent',
//     //   displayName: 'Catalog',
//     //   path: '../src/services/custom/CatalogComponent',
//     //   options: {
//     //     import: (path: string) => {
//     //       return import(path).then((module: any) => {
//     //         return module.Catalog;
//     //       })
//     //     },
//     //     render: (Component: any, props: any, domSelector: string) => {},
//     //     definition: {
//     //       name: 'CatalogComponent',
//     //       props: {},
//     //     },
//     //   },
//     // },
//   ]
// };

import { envRegistry } from '../src/mocks/envRegistry';
import { workspaceConfig } from '../src/mocks/workspaceConfig';
import { token } from '../src/const';

localStorage.setItem(`localhost:1234.environmentRegistry`, JSON.stringify(envRegistry));

describe('POC', () => {

  it('Calls services methods using proxies', async () => {
    // expect.assertions(3);

    (window as any)['workspace'] = new Workspace({ token: 'abc', config: workspaceConfig});
    const workspace = (window as any)['workspace'];

    await workspace.start().catch((e: any) => console.log(e));

    console.log('workspace', workspace);

    try {
      const services = await workspace.services({});
      console.log('services', services);
    } catch (e) {
      console.log('e', e);
    }
    // const services = await workspace.services({});

    // console.log('parrotService', services);
    //
    // const parrotService = services.Parrot;
    // const greetingService = services.Greeting;
    //
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

