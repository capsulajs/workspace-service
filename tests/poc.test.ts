import { Workspace } from '../src/Workspace';
import { envRegistry } from '../src/mocks/envRegistry';
import { workspaceConfig } from '../src/mocks/workspaceConfig';
import { token } from '../src/const';

localStorage.setItem(`localhost:1234.environmentRegistry`, JSON.stringify(envRegistry));

describe('POC', () => {

  // beforeEach(() => {
  //   document.body.innerHTML = '<div id="root"></div>';
  // });

  it('Service methods can be executed correctly after workspace has been started', async () => {
    expect.assertions(3);

    (window as any)['workspace'] = new Workspace({ token: 'abc', config: workspaceConfig});
    const workspace = (window as any)['workspace'];

    await workspace.start().catch((e: any) => console.log(e));

    const parrotService = await workspace.service({ serviceName: 'ParrotService' });
    const greetingService = await workspace.service({ serviceName: 'GreetingService' });

    return parrotService.proxy.repeat('Say heyyyy')
      .then((response) => expect(response).toEqual({ response: 'Say heyyyy', token }))
      .then(() => greetingService.proxy.hello())
      .then((response) => expect(response).toBe('Hello'))
      .then(() => greetingService.proxy.helloToParrot('Hey parrot'))
      .then((response) => expect(response).toEqual({ response: 'HelloHey parrot', token }));
  });

  // it('Layout', async (done) => {
  //   // expect.assertions(3);
  //
  //   // console.log('Cat', Catalog);
  //
  //   (window as any)['workspace'] = new Workspace({ token: 'abc', config});
  //   const workspace = (window as any)['workspace'];
  //
  //   await workspace.start();
  //
  //   setTimeout(done, 2000);
  // });

});

