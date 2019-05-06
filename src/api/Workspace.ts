import { CreateWorkspaceRequest } from './methods/createWorkspace';
import { ServicesMap, ServicesRequest } from './methods/services';
import { RegisterServiceRequest } from './methods/registerService';
import { ComponentsMap, ComponentsRequest } from './methods/components';

/**
 * Workspace is the core service of Capsula Hub, it is responsible for :
 * - Allowing services to register themselves (REGISTER)
 * - Letting services and components communicate together (SERVICES/COMPONENTS)
 * - Getting their own configuration (CONFIG)
 */
export interface Workspace {
  /**
   * Getting a map of promises to each service that has been loaded in the workspace
   * Reject in case :
   * - Invalid request
   * - Workspace not started yet
   * @param servicesRequest
   */
  services(servicesRequest: ServicesRequest): Promise<ServicesMap>;

  /**
   * Getting a map of promises to each component that has been loaded in the workspace
   * Reject in case :
   * - Invalid request
   * - Workspace not started yet
   * @param componentsRequest
   */
  components(componentsRequest: ComponentsRequest): Promise<ComponentsMap>;

  /**
   * Register a service in the workspace.
   * Reject in case :
   * - Invalid request
   * - Workspace not started yet
   * - Service specified in request doesn't exist in workspace configuration
   * - Service specified in request already registered
   * - Invalid request
   * @param registerServiceRequest
   */
  registerService(registerServiceRequest: RegisterServiceRequest): Promise<void>;
}

/**
 * Creating a workspace and loading all services and components included in its configuration.
 * CAPSULAHUB_WORKSPACE and CAPSULAHUB_CONFIGURATION variables are available for loaded services and components,
 * this way they can access the workspace methods and their configuration without using global scope.
 * Reject in case :
 * - Invalid request
 * - An error with importing a service occurred
 * - An error with importing a component occurred
 * - An error with registering a component occurred
 * @param createWorkspaceRequest
 */
type CreateWorkspace = (createWorkspaceRequest: CreateWorkspaceRequest) => Promise<Workspace>;
