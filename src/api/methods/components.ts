export interface ComponentsRequest {}

export interface Component {
  componentName: string;
  nodeSelector: string;
  reference: any;
}

export interface ComponentsMap {
  [componentName: string]: Promise<Component>;
}
