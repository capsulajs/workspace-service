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
            const envRegistry = await workspace.service('EnvRegistry');
            const envSelector = await workspace.service('EnvSelector');

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
            const envSelector = await workspace.service('EnvSelector');
            const methodSelector = await workspace.service('MethodSelector');

            envSelector
              .selected({})
              .do((env: any) => methodSelector.input(env.methods))
              .subscribe();
          },
        },
        // {
        //   name: 'invokeService',
        //   id: '2',
        //   flow: async () => {
        //     const methodSelector = await workspace.service('MethodSelector');
        //     const invoker = await workspace.service('Invoker');
        //
        //     methodSelector
        //       .selected()
        //       .do((method: any) => invoker.input({ service: method.service }))
        //       .subscribe();
        //   },
        // },
      ],
    };
  }

  public async init() {
    this.config.flows.forEach((flow: any) => flow.flow());
  }
}
