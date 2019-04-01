/**
 *  Orchestrator service is responsible for creating flow between workspace services
 */
class Orchestrator {
  private config: any;

  constructor(token: string) {
    this.config = {
      flows: [
        {
          name: 'setEnvironments',
          id: '1',
          flow: async () => {
            const workspace = (window as any)['workspace'];
            const envRegistry = (await workspace.service('EnvRegistry')).proxy;
            const envSelector = (await workspace.service('EnvSelector')).proxy;

            envRegistry
              .environments$({})
              .toArray()
              .do((envs: any) => envSelector.input({ data: envs }))
              .subscribe();
          },
        },
        {
          name: 'setMethods',
          id: '2',
          flow: async () => {
            const workspace = (window as any)['workspace'];
            const envSelector = (await workspace.service('EnvSelector')).proxy;
            const methodSelector = (await workspace.service('MethodSelector')).proxy;

            envSelector
              .selected({})
              .do((env: any) => methodSelector.input(env.methods))
              .subscribe();
          },
        },
      ],
    };
  }

  public async init() {
    this.config.flows.forEach((flow: any) => flow.flow());
  }
}
