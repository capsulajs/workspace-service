import { Selector } from './__mocks__/services/Selector';
import { from } from 'rxjs';
import { errorMessage, validationMessages } from './__mocks__/helpers/messages';

// const obsToPromise = obs => new Promise((complete, error) => obs.subscribe({ complete, error }));

describe('Selector tests', () => {
  const envs = [
    {
      envKey: 'develop',
      env: {
        services: [
          {
            serviceName: 'service1',
            url: 'http://test.com/service1',
            methods: {
              method1: { asyncModel: 'RequestResponse' },
              method2: { asyncModel: 'RequestResponse' },
              method3: { asyncModel: 'RequestStream' },
              method4: { asyncModel: 'RequestResponse' },
              method5: { asyncModel: 'RequestStream' },
            }
          },
          {
            serviceName: 'service2',
            url: 'http://test.com/service2',
            methods: {
              method1: { asyncModel: 'RequestResponse' },
              method2: { asyncModel: 'RequestResponse' },
            }
          },
        ]
      }
    },
    {
      envKey: 'master',
      env: {
        services: [
          {
            serviceName: 'service1',
            url: 'http://test.com/service1',
            methods: {
              method1: { asyncModel: 'RequestResponse' },
              method2: { asyncModel: 'RequestResponse' },
              method3: { asyncModel: 'RequestStream' },
              method4: { asyncModel: 'RequestResponse' },
              method5: { asyncModel: 'RequestStream' },
            }
          },
          {
            serviceName: 'service2',
            url: 'http://test.com/service2',
            methods: {
              method1: { asyncModel: 'RequestResponse' },
              method2: { asyncModel: 'RequestResponse' },
            }
          },
        ]
      }
    },
  ];
  const envRegistryItem$ = from([envs]);

  it('selector input / output$', async (done) => {
    expect.assertions(1);
    const envSelector = new Selector();

    await envSelector.input({ data: envRegistryItem$ });

    envSelector.output$({}).subscribe(((item) => {
      expect(item).toEqual(envs);
      done();
    }));
  });

  it('selector select / selected$', async (done) => {
    expect.assertions(2);

    const envSelector = new Selector();
    await envSelector.input({ data: envRegistryItem$ });

    let counter = 0;
    envSelector.selected$({}).subscribe((env) => {
      switch (counter) {
        case 0: expect(env).toEqual({});
          break;
        case 1: expect(env).toEqual(envs[1]);
          done();
          break;
      }
      counter = counter + 1;
    });

    await envSelector.select({ key: { envKey: 'master' }});
  });
});
