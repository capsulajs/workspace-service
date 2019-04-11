export const importFake = (modules: object, path: string): Promise<any> => {
  return Promise.resolve({ default: modules[path] });
};

export const prepareWebComponent = ({ name, path, componentModules }) => {
  return importFake(componentModules, path)
    .then((module: any) => module.default)
    .then((WebComponent) => {
      customElements.define(name, WebComponent);
      const webComponent = new WebComponent();
      typeof webComponent.setState === 'function' && webComponent.setState();
      return webComponent;
    });
};
