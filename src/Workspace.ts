import { Workspace as WorkspaceInterface } from './api/Workspace';
import { StartRequest } from './api/methods/start';
import { ServiceRequest, ServiceResponse } from './api/methods/service';
import { RegisterRequest } from './api/methods/register';

interface RegisteredService {
  serviceName: string;
  displayName: string;
  definition: any; // Definition
  registered: boolean;
}

class Workspace implements WorkspaceInterface {
  private readonly token: string;
  private serviceRegistry: { [serviceName: string]: RegisteredService };
  private config: any;
  private started: boolean;

  constructor(token: string) {
    this.token = token;
    this.serviceRegistry = {};
    this.started = false;
    this.config = {
      name: 'POC',
      services: [
        {
          name: 'Service1',
          displayName: 'The first service',
          url: '',
          options: {
            getInstance: (module: any) => new module.default(this.token),
            definition: {},
          },
        },
        {
          name: 'Service2',
          displayName: 'The second service',
          url: '',
          options: {},
        },
      ],
    };
  }

  public start(startRequest: StartRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.started) {
        reject('Already started');
      } else {
        const scalecubeBuilder = scalecube.builder();

        this.config.services.forEach((service: ServiceConfig) => {
          import(service.url)
            .then((serviceModule) => {
              // Get instance of the service
              const instance = service.options.getInstance
                ? service.options.getInstance(serviceModule)
                : new serviceModule.default();

              // Add the instance to scalecube
              scalecubeBuilder.services(instance);

              // Add the service to the internal registry
              this.serviceRegistry[service.name] = {
                serviceName: service.name,
                displayName: service.displayName,
                definition: service.options.definition || instance.definition,
                registered: false,
              };
            })
            .catch((e) => reject(e));
        });

        scalecubeBuilder.build();
        this.started = true;
        resolve();
      }
    });
  }

  public service(serviceRequest: ServiceRequest): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      const service = this.serviceRegistry[serviceRequest.serviceName];
      if (!service || !service.registered) {
        reject('Service not found');
      } else {
        // Get proxy from scalecube and resolve
        const proxy = scalecube
          .proxy()
          .api(service.definition)
          .create();
        resolve({
          serviceName: service.serviceName,
          displayName: service.displayName,
          proxy,
        });
      }
    });
  }

  public register(registerRequest: RegisterRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const { displayName, serviceName } = registerRequest;
      const service = this.serviceRegistry[registerRequest.serviceName];

      if (!service) {
        reject('Service not found');
      } else if (service.registered) {
        reject('Service already registered');
      } else {
        this.serviceRegistry[serviceName] = {
          ...service,
          displayName,
          registered: true,
        };
        resolve();
      }
    });
  }
}
