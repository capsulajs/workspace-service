export const createWebComponentWithData = ({ WebComponent, data }) => {
  customElements.define('web-catalog', WebComponent);
  const webComponent = document.createElement('web-catalog');
  (webComponent as any).data = data;
  return webComponent;
};
