interface Workspace {
  // Load all the services from url
  // Load the layout and render components inside
  start(startRequest: StartRequest) : Promise<void>;

  // Returns proxy of a registered service
  // Can be used by any service during run time to get a proxy of another service
  service(serviceRequest: ServiceRequest): Promise<ServiceResponse>;

  // Register a service or a component in the workspace
  // Can be used by any service to register itself and become available with Worspace.service method
  register(registerRequest: RegisterRequest): Promise<void>;

  /*
  // For future / To be defined
  // Allow persistence of services state
  persist({ serviceName: string }): Promise<>;
  state({ serviceName: string }): Observable<ServiceState>;
  */
}

interface StartRequest {
  token: string;
}

interface Service {
  name: string;
  displayName: string;
}

interface ServiceRequest extends Service {}

interface RegisterRequest extends Service {}

interface ServiceResponse extends Service {
  proxy: any // TODO
}
