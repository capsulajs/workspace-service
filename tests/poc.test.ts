import { Workspace } from '../src/Workspace';
import { envRegistry } from '../src/mocks/envRegistry';
import { workspaceConfig } from '../src/mocks/workspaceConfig';
import { token } from '../src/const';

localStorage.setItem(`localhost:1234.environmentRegistry`, JSON.stringify(envRegistry));

describe('POC', () => {
  it('Calls services methods using proxies', async () => {
    expect.assertions(3);

    const workspace = new Workspace({ token, config: workspaceConfig });
    window.workspace = workspace;
    await workspace.start({ token });
    const services = await workspace.services({});
    const { parrotService, greetingService } = services;

    await expect(parrotService.proxy.repeat('Say heyyyy')).resolves.toEqual({ response: 'Say heyyyy', token });
    await expect(greetingService.proxy.hello()).resolves.toEqual('Hello');
    await expect(greetingService.proxy.helloToParrot('Hey parrot')).resolves.toEqual({
      response: 'HelloHey parrot',
      token,
    });
  });
});
