import { ServiceDefinition } from '@scalecube/scalecube-microservice/lib/api';

interface WorkspaceConfig {
  name: string;
  services: ServiceConfig[];
  components: ComponentConfig[];
}

interface ServiceConfig {
  serviceName: string;
  path: string;
  definition: ServiceDefinition;
  config: { [key: string]: any };
}

interface ComponentConfig {
  componentName: string;
  path: string;
  nodeSelector: string;
}
