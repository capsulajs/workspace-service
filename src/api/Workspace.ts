import { ServicesMap, ServicesRequest } from './methods/services';
import { RegisterServiceRequest } from './methods/registerService';
import { ComponentsMap, ComponentsRequest } from './methods/components';

/**
 * Workspace is the core service of Capsula Hub, it is responsible for :
 * - Allowing services to register themselves (REGISTER)
 * - Letting services and components communicate together (SERVICES/COMPONENTS)
 * - Getting their own configuration (CONFIG)
 * Workspace need to be instantiated with a configuration service
 */
export interface Workspace {
  /**
   * Getting a map of promises to each service that has been loaded in the workspace
   * Reject in case :
   * - Invalid request
   * @param servicesRequest
   */
  services(servicesRequest: ServicesRequest): Promise<ServicesMap>;

  /**
   * Getting a map of promises to each component that has been loaded in the workspace
   * Reject in case :
   * - Invalid request
   * @param componentsRequest
   */
  components(componentsRequest: ComponentsRequest): Promise<ComponentsMap>;

  /**
   * Register a service in the workspace.
   * Reject in case :
   * - Invalid request
   * - Service specified in request doesn't exist in workspace configuration
   * - Service specified in request already registered
   * - Invalid request
   * @param registerServiceRequest
   */
  registerService(registerServiceRequest: RegisterServiceRequest): Promise<void>;
}
