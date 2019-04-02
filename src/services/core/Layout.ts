import Catalog from '../../webComponents/Catalog';
import { data$ } from '../../webComponents/helpers/catalogDataStream';

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
        .then((data: any) => data.default)
        .then((WebComponent: any) => {
          customElements.define(name, WebComponent);
          const webComponent = document.createElement(name);
          webComponent.data = data$;
          document.querySelector(nodeSelector)!.appendChild(webComponent);
        });
    }));
  }

}
