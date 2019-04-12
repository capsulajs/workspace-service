import { toArray, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import isEmpty from 'lodash/isEmpty';

/**
 *  Orchestrator service is responsible for creating flow between workspace services
 */
export class Orchestrator {
  private config: any;

  constructor(token: string) {
    this.config = {
      flows: [
        {
          name: 'setEnvironments',
          id: '1',
          flow: async () => {
            const workspace = (window as any).workspace;
            const envRegistry = (await workspace.service({ serviceName: 'EnvRegistryService' })).proxy;
            const envSelector = (await workspace.service({ serviceName: 'EnvSelectorService' })).proxy;

            envRegistry
              .environments$({})
              .pipe(toArray())
              .subscribe((envs: any) => envSelector.input({ data: from([envs]) }));
          },
        },
        {
          name: 'setMethods',
          id: '2',
          flow: async () => {
            const workspace = (window as any).workspace;
            const envSelector = (await workspace.service({ serviceName: 'EnvSelectorService' })).proxy;
            const methodSelector = (await workspace.service({ serviceName: 'MethodSelectorService' })).proxy;

            envSelector.selected$({}).subscribe((item: any) => {
              if (item && !isEmpty(item)) {
                const methods: any = []; // define interface
                item.env.services.forEach((service) => {
                  Object.keys(service.methods).forEach((key) => {
                    methods.push({ serviceName: service.serviceName, methodName: key });
                  });
                });

                console.log('ORCH envSelector.selected$ methods', methods);

                methodSelector.input({ data: from([methods]) });
              }
            });
          },
        },
      ],
    };
  }

  public init() {
    this.config.flows.forEach((configFlow: any) => configFlow.flow());
  }
}
