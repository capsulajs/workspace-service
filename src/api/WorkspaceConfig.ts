interface WorkspaceConfig {
  name: string;
  services: ServiceConfig[];
}

interface ServiceConfig {
  name: string;
  displayName: string;
  url: string;
  options: { [key: string]: any };
}
