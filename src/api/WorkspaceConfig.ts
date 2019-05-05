interface WorkspaceConfig {
  name: string;
  services: ServiceConfig[];
  components: ComponentConfig[];
}

interface ServiceConfig {
  serviceName: string;
  displayName: string;
  path: string;
  options: { [key: string]: any };
}

interface ComponentConfig {
  componentName: string;
  path: string;
  nodeSelector: string;
}
