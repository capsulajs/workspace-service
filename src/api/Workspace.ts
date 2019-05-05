import { StartRequest } from './methods/start';
import { ServicesMap, ServicesRequest } from './methods/services';
import { RegisterServiceRequest } from './methods/registerService';
import { ComponentsMap, ComponentsRequest } from './methods/components';
import { ConfigRequest } from './methods/config';

export interface Workspace {
  // Loads all the services from path
  // Loads the layout and renders components inside
  start(startRequest: StartRequest): Promise<void>;

  // Returns all the registered services with its proxies included.
  // Can be rejected, if Workspace has not been started yet
  services(servicesRequest: ServicesRequest): Promise<ServicesMap>;

  // Returns all the registered components
  components(componentsRequest: ComponentsRequest): Promise<ComponentsMap>;

  // Register a service in the workspace
  // Can be used by any service to register itself and become available with Workspace.service method
  registerService(registerServiceRequest: RegisterServiceRequest): Promise<void>;

  // Get a service config
  config(configRequest: ConfigRequest): Promise<any>;
}
