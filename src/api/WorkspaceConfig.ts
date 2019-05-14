interface WorkspaceConfig {
  name: string;
  services: ServiceConfig[];
}

interface ServiceConfig {
  serviceName: string;
  displayName: string;
  path: string;
  options: { [key: string]: any };
}
