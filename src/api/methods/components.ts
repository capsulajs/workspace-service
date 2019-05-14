export interface ComponentsRequest {}

export interface Component {
  componentName: string;
  nodeId: string;
  reference: any;
}

export interface ComponentsMap {
  /** Each promise will be resolved when the corresponding component will be registered */
  [componentName: string]: Promise<Component>;
}
