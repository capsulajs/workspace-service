import { Workspace as WorkspaceInterface } from './api/Workspace';
import { StartRequest } from './api/methods/start';
import { ServiceRequest, ServiceResponse } from './api/methods/service';
import { RegisterRequest } from './api/methods/register';
import { Microservices } from '@scalecube/scalecube-microservice';
import { ProxyOptions, Service } from '@scalecube/scalecube-microservice/lib/src/api/public';

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
  private microservice: any;

  constructor(args: { token: string; config: any }) {
    this.token = args.token;
    this.config = args.config;
    this.serviceRegistry = {};
    this.started = false;
  }

  public start(startRequest: StartRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.started) {
        reject('Already started');
      } else {

        // TODO Go over each service of this.config.services :
        // - Use service.getInstance to create instance of it
        // - Register the service in the workspace

        // When all services are instantiated and registered :
        // - Create scalecube microservice with all instances

        const services = this.config.services.map(async (service: any) => {
          const { serviceName, displayName, path, options, getInstance } = service;
          return new Promise(async (res, rej) => {
            // TODO add error path
            const instance = await getInstance(path, this.token);

            // Add the service to the internal registry (TODO should be done by the service itself, not the workspace)
            await this.register({
              serviceName,
              displayName,
              definition: options.definition,
            });

            res({ definition: options.definition, reference: instance });
          })
        });

        Promise.all(services as Promise<Service>[])
          .then(s => {
            console.log('LOAD SUCCESS', s);
            this.microservice = Microservices.create({ services: s });
            this.started = true;
            resolve();
          })
          .catch((e) => reject(e));


        // Init layout

        // Init orchestrator
      }
    });
  }

  public service(serviceRequest: ServiceRequest): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      if (!this.started) {
        return reject('Workspace not started yet');
      }

      const service = this.serviceRegistry[serviceRequest.serviceName];
      console.log('registry', this.serviceRegistry);

      return !service
        ? reject('Service not found')
        : resolve({
            serviceName: service.serviceName,
            displayName: service.displayName,
            proxy: this.microservice.createProxy({ serviceDefinition: service.definition }),
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
