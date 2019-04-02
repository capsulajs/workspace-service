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
    return Promise.all(
      Object.values(window['workspace'].serviceRegistry)
        .map((serviceData: any) => window['workspace'].service({ serviceName: serviceData.serviceName }))
    )
      .then((servicesList) => {
        const services = servicesList
          .reduce((acc: any, service: any) => {
            return { ...acc, [service.serviceName]: service.proxy }
          }, {} as any);

        return Promise.all(this.config.componentsAfterLoad.map(({ name, nodeSelector, path }) => {
          return importFake(path)
            .then((module: any) => module.default)
            .then((WebComponent) => {
              customElements.define(name, WebComponent);
              document.querySelector(nodeSelector)!.appendChild(new WebComponent(services));
            });
        }));
      });
  }

}
