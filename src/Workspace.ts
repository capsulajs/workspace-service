import { Workspace as WorkspaceInterface } from './api/Workspace';
import { StartRequest } from './api/methods/start';
import { ServiceRequest, ServiceResponse } from './api/methods/service';
import { RegisterRequest } from './api/methods/register';
import { scalecube } from './scalecube';

interface RegisteredService {
  serviceName: string;
  displayName: string;
  definition: any;
}

export class Workspace implements WorkspaceInterface {
  private readonly token: string;
  private serviceRegistry: { [serviceName: string]: RegisteredService };
  private config: any;
  private started: boolean;
  private internalSc: any;

  constructor(args: { token: string; config: WorkspaceConfig }) {
    this.token = args.token;
    this.config = args.config;
    this.serviceRegistry = {};
    this.started = false;
  }

  public getToken() {
    return this.token;
  }

  public start(startRequest: StartRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.started) {
        reject('Already started');
      } else {
        const scalecubeBuilder = scalecube.builder();

        const imports = this.config.services.map(async (service: ServiceConfig) => {
          const { serviceName, displayName, path, options, getInstance } = service;

          // Get the service instance
          const instance = await getInstance(path, this.token);

          // Add the instance to scalecube
          scalecubeBuilder.services(instance);

          // Add the service to the internal registry (TODO should be done by the service itself, not the workspace)
          return this.register({
            serviceName,
            displayName,
            definition: options.definition,
          });
        });

        Promise.all(imports)
          .then(() => {
            this.internalSc = scalecubeBuilder.build();
            this.started = true;
            resolve();
          })
          .catch((e) => reject(e));
      }
    });
  }

  public service(serviceRequest: ServiceRequest): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      if (!this.started) {
        return reject('Workspace not started yet');
      }

      const service = this.serviceRegistry[serviceRequest.serviceName];

      return !service
        ? reject('Service not found')
        : resolve({
            serviceName: service.serviceName,
            displayName: service.displayName,
            proxy: this.internalSc
              .proxy()
              .api({ definition: service.definition })
              .create(),
          });
    });
  }

  public register(registerRequest: RegisterRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const service = this.serviceRegistry[registerRequest.serviceName];

      if (!!service) {
        reject('Service already registered');
      } else {
        this.serviceRegistry[registerRequest.serviceName] = { ...registerRequest };
        resolve();
      }
    });
  }
}
