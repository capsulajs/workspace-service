import { ServiceDefinition } from '@scalecube/scalecube-microservice/lib/api';

interface Service {
  serviceName: string;
  path: string;
  definition: ServiceDefinition;
  config: { [key: string]: any };
}

interface Component {
  componentName: string;
  path: string;
  config: any;
}

interface WorkspaceConfig {
  name: string;
  services: Service[];
  components: {
    layouts: { [nodeId: string]: Component };
    items: { [nodeId: string]: Component };
  };
}
