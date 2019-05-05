import { StartRequest } from './methods/start';
import { ServicesMap, ServicesRequest } from './methods/services';
import { RegisterServiceRequest } from './methods/registerService';
import { ComponentsMap, ComponentsRequest } from './methods/components';
import { ConfigRequest } from './methods/config';

/**
 * Workspace is the core service of CapsulaHub, it is responsible for :
 * - Loading services and components that are included in its configuration (START)
 * - Allowing them to register themselves (REGISTER)
 * - Letting them communicate together (SERVICES/COMPONENTS)
 * - Getting their own configuration (CONFIG)
 */
export interface Workspace {
  /**
   * Loading all services and components included in workspace configuration
   * Reject in case :
   * - Workspace already started
   * - Workspace start already in progress
   * - An error with importing a service occurred
   * - An error with importing a component occurred
   * - An error with registering a component occurred
   * @param startRequest
   */
  start(startRequest: StartRequest): Promise<void>;

  /**
   * Getting promises to each service that has been loaded in the workspace
   * Reject in case :
   * - Workspace not started yet
   * @param servicesRequest
   */
  services(servicesRequest: ServicesRequest): Promise<ServicesMap>;

  /**
   * Getting promises to each component that has been loaded in the workspace
   * Reject in case :
   * - Workspace not started yet
   * @param componentsRequest
   */
  components(componentsRequest: ComponentsRequest): Promise<ComponentsMap>;

  /**
   * Register a service in the workspace.
   * Reject in case :
   * - Workspace not started yet
   * - Service specified in request doesn't exist in workspace configuration
   * - Service specified in request already registered
   * - Invalid request
   * @param registerServiceRequest
   */
  registerService(registerServiceRequest: RegisterServiceRequest): Promise<void>;

  /**
   * Get the configuration of a specific service
   * Reject in case :
   * - Service specified in request doesn't exist
   * @param configRequest
   */
  config(configRequest: ConfigRequest): Promise<any>;
}
