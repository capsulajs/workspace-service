import { Workspace as WorkspaceInterface } from './api/Workspace';
import { StartRequest } from './api/methods/start';
import { ServicesRequest, ServicesResponse } from './api/methods/services';
import { ServiceRequest, ServiceResponse } from './api/methods/service';
import { RegisterRequest } from './api/methods/register';
import { Microservices } from '@scalecube/scalecube-microservice';
import { Service } from '@scalecube/scalecube-microservice/lib/api';
import { Layout } from './services/core/Layout';

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
        this.started = true;
        const services = this.config.services.map(async (service: any) => {
          const { serviceName, displayName, path, options, getInstance } = service;
          return new Promise(async (res, rej) => {
            // TODO catch errors
            const instance = await getInstance(path, this.token);

            // TODO should be done by the service itself, not the workspace
            // Add the service to the internal registry
            await this.register({
              serviceName,
              displayName,
              definition: options.definition,
            });

            res({ definition: options.definition, reference: instance });
          })
        });

        Promise.all(services as Array<Promise<Service>>)
          .then((s) => {
            console.log('LOAD SUCCESS', s);
            this.microservice = Microservices.create({ services: s });

            // TODO Load  and register components

            // Init layout
            const layout = new Layout({ token: this.token, config: this.config.components });
            layout.render()
              .catch((error: Error) => console.error('Error while rendering layout: ', error.message));

            // Init orchestrator
            // const orchestrator = new Orchestrator(this.token);
            // orchestrator.init();

            resolve();
          })
          .catch((e) => reject(e));
      }
    });
  }

  public services(servicesRequest: ServicesRequest): Promise<ServicesResponse> {
    return new Promise((resolve, reject) => {
      if (!this.microservice) {
        return reject('Workspace not started yet');
      }

      const services = Object.values(this.serviceRegistry)
        .reduce((services, serviceData) => {
          return {
            ...services,
            [serviceData.displayName]: {
              serviceName: serviceData.serviceName,
              displayName: serviceData.displayName,
              proxy: this.microservice.createProxy({ serviceDefinition: serviceData.definition }),
            }
          }
        }, {});

      resolve(services);
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
