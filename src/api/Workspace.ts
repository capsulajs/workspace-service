import { StartRequest } from './methods/start';
import { ServicesRequest, ServicesResponse } from './methods/services';
import { ServiceRequest, ServiceResponse } from './methods/service';
import { RegisterRequest } from './methods/register';

export interface Workspace {
  // Load all the services from path
  // Load the layout and render components inside
  start(startRequest: StartRequest): Promise<void>;

  // Returns all the registered services with its proxies included.
  // Can be rejected, if Workspace has not been started yet
  services(servicesRequest: ServicesRequest): Promise<ServicesResponse>;

  service(serviceRequest: ServiceRequest): Promise<ServiceResponse>;

  // Register a service or a component in the workspace
  // Can be used by any service to register itself and become available with Workspace.service method
  register(registerRequest: RegisterRequest): Promise<void>;

  /*
  // For future / To be defined
  // Allow persistence of services state
  persist({ serviceName: string }): Promise<>;
  state({ serviceName: string }): Observable<ServiceState>;
  */
}
