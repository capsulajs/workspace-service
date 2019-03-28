import { from, Observable } from 'rxjs';

/**
 * Layout service is responsible for each component to:
 * - fetch the correct props in relevant services
 * - render the component in the grid
 * - re-render the component when it's necessary (props changed)
 *
 */

class Layout {
  private config: any;

  constructor(token: string) {
    this.config = {
      thingsThatYouWantToLoadBeforeTheComponentsLikeGrid: [
        {
          name: 'Grid',
          props: {
            data: 'First layout data',
          },
          nodeSelector: 'div#workspace',
        },
      ],
      components: [
        {
          name: 'EnvironmentSelector',
          data$: async () => {
            const workspace = (window as any)['workspace'];
            const envSelector = (await workspace.service('EnvSelector')).proxy;

            return envSelector.output()
              .combineLatest(envSelector.selectedEnv())
              .map(e => ({
                envs: e[0],
                selectedEnv: e[1],
                selectEnv: envSelector.selectEnv()
              }));
          },
          nodeSelector: '#grid #envSelector',
        },
        {
          name: 'Catalog',
          data$: async () => {
            const workspace = (window as any)['workspace'];
            const methodSelector = (await workspace.service('MethodSelector')).proxy;

            return methodSelector.output()
              .combineLatest(methodSelector.selectedMethod())
              .map(e => ({
                methods: e[0],
                selectedMethod: e[1],
                selectMethod: methodSelector.selectMethod()
              }));
          },
          nodeSelector: '#grid #catalog',
        },
      ],
    };
  }

  // TODO everything here is draft or old

  private prepareLayout(): Promise<void> {
    this.config.thingsThatYouWantToLoadBeforeTheComponentsLikeGrid.forEach((component, i) => {
      const components = (window as any)['workspace'].service('Components');
      // TODO
      components[component.name].render(component.props, this.config.components[i].nodeSelector);
    });
    return Promise.resolve();
  }

  defineComponents(): Promise<void> {
    this.config.components.forEach(component => {
      window.customElements.define(`workspace-${component.name}`, component.constructor);
    });
    return Promise.resolve();
  }

  appendToDom(): Promise<void> {

    return Promise.resolve();
  }

}
