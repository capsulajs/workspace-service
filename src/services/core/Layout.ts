import Catalog from '../../webComponents/Catalog';

const importFake = (path: string): Promise<any> => {
  const components = {
    ['../../webComponents/Catalog.tsx']: Catalog
  };

  return Promise.resolve({ default: components[path] });
};

/**
 * Layout service is responsible for each component to:
 * - fetch the correct props in relevant services
 * - render the component in the grid
 * - re-render the component when it's necessary (props changed)
 *
 */

export class Layout {
  private config: any;

  constructor({ token, config }: { token: string, config: object }) {
    this.config = config;
  }

  public render() {
    return Promise.all(this.config.componentsAfterLoad.map(({ name, nodeSelector, path }) => {
      return importFake(path)
        .then((module: any) => module.default)
        .then((WebComponent: any) => {
          customElements.define(name, WebComponent);
          const services = Object.values(window['workspace'].serviceRegistry)
            .reduce((acc: any, current: any) => {
              return {
                ...acc,
                [current.serviceName]: window['workspace'].microservice.createProxy({ serviceDefinition: current.definition })
              }
            }, {} as any);
          const webComponent = new WebComponent(services);
          webComponent.setState();
          document.querySelector(nodeSelector)!.appendChild(webComponent);
        });
    }));
  }

}
