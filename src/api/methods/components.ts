export interface RegisteredComponent {
  componentName: string;
  nodeSelector: string;
  reference: any;
}

export interface ComponentsMap {
  [componentName: string]: RegisteredComponent;
}
