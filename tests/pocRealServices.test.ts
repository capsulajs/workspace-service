import { Workspace } from '../src/Workspace';
import { envRegistry } from '../src/mocks/envRegistry';
import { workspaceConfig } from '../src/mocks/workspaceConfig';

// TODO Fix this test according to the requirement
describe.skip('POC', () => {
  it('...', async (done) => {
    expect.assertions(4);

    localStorage.setItem(`localhost:1234.environmentRegistry`, JSON.stringify(envRegistry));

    (window as any).workspace = new Workspace({ token: 'abc', config: workspaceConfig });
    const workspace = (window as any).workspace;

    await workspace.start().catch((e: any) => new Error(e));

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

    // methodSelectorService.output$({}).subscribe({
    //   next: (method) => console.log,
    //   complete: () => done()
    // });
  });
});
