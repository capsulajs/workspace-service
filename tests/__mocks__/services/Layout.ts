import { from } from 'rxjs';

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
          name: 'Catalog',
          flow: async () => {
            const methodSelector = await workspace.service('MethodSelector');
            return methodSelector.output();
          },
          nodeSelector: '#grid #catalog',
        },
        {
          name: 'Logs',
          flow: async () => {
            const invoker = await workspace.service('Invoker');
            return invoker.logs();
          },
          nodeSelector: '#grid #logs',
        },
      ],
    };
  }

  private prepareLayout(): Promise<void> {
    this.config.thingsThatYouWantToLoadBeforeTheComponentsLikeGrid.forEach((component, i) => {
      const components = (window as any)['workspace'].service('Components');
      components[component.name].render(component.props, this.config.components[i].nodeSelector);
    });
    return Promise.resolve();
  }

  public async render() {
    await this.prepareLayout();

    // What layout should do for each component
    this.config.components.forEach((component, i) => {
      component.flow().subscribe((props) => {
        const components = (window as any)['workspace'].service('Components');
        components[component.name].render(props, this.config.components[i].nodeSelector);
      });
    });
  }
}
