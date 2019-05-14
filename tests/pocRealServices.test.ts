import { Workspace } from '../src/Workspace';
import { envRegistry } from '../src/mocks/envRegistry';
import { workspaceConfig } from '../src/mocks/workspaceConfig';
import { token } from '../src/const';

describe('POC Real services', () => {
  it('Env registry and selector work correctly', async (done) => {
    expect.assertions(4);

    Object.defineProperty(window, 'localStorage', {
      value: (() => {
        return {
          getItem: () => JSON.stringify(envRegistry),
        };
      })(),
    });

    const workspace = new Workspace({ token: 'abc', config: workspaceConfig });
    window.workspace = workspace;

    await workspace.start({ token }).catch((e: any) => new Error(e));

    const envSelectorService = (await workspace.service({ serviceName: 'EnvSelectorService' })).proxy;
    const methodSelectorService = (await workspace.service({ serviceName: 'MethodSelectorService' })).proxy;

    const testMethods = {
      develop: [
        { serviceName: 'service1', methodName: 'myTestMethod1' },
        { serviceName: 'service2', methodName: 'myTestMethod1' },
        { serviceName: 'service2', methodName: 'myTestMethod2' },
        { serviceName: 'service2', methodName: 'myTestMethod3' },
      ],
      master: [
        { serviceName: 'service1', methodName: 'myTestMethod1' },
        { serviceName: 'service2', methodName: 'myTestMethod1' },
        { serviceName: 'service2', methodName: 'myTestMethod2' },
      ],
      'tag-1': [
        { serviceName: 'service1', methodName: 'myTestMethod1' },
        { serviceName: 'service2', methodName: 'myTestMethod1' },
        { serviceName: 'service2', methodName: 'myTestMethod2' },
      ],
      'tag-2': [
        { serviceName: 'service1', methodName: 'myTestMethod1' },
        { serviceName: 'service2', methodName: 'myTestMethod1' },
        { serviceName: 'service2', methodName: 'myTestMethod2' },
        { serviceName: 'service2', methodName: 'myTestMethod42' },
      ],
    };

    let counter = 0;
    methodSelectorService.output$({}).subscribe((item) => {
      switch (counter) {
        case 0:
          expect(item).toEqual([]);
          break;
        case 1:
          expect(item).toEqual(testMethods['tag-2']);
          break;
        case 2:
          expect(item).toEqual(testMethods.master);
          break;
        case 3:
          expect(item).toEqual(testMethods.develop);
          done();
          break;
      }
      counter = counter + 1;
    });

    await envSelectorService.select({ key: { envKey: 'tag-2' } });
    await envSelectorService.select({ key: { envKey: 'master' } });
    await envSelectorService.select({ key: { envKey: 'develop' } });
  });
});
