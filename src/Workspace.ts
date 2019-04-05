import { Workspace as WorkspaceInterface } from './api/Workspace';
import { StartRequest } from './api/methods/start';
import { ServiceRequest, ServiceResponse } from './api/methods/service';
import { RegisterRequest } from './api/methods/register';
import { Microservices } from '@scalecube/scalecube-microservice';
import Service from '@scalecube/scalecube-microservice/lib/api/Service';
import { Layout } from './services/core/Layout';
import { Orchestrator } from './services/core/Orchestrator';

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
          .then(s => {
            // console.log('LOAD SUCCESS', s);
            this.microservice = Microservices.create({ services: s });
            this.started = true;

            // TODO Load  and register components

            // Init layout
            const layout = new Layout(this.token);
            layout.render();

            // Init orchestrator
            const orchestrator = new Orchestrator(this.token);
            orchestrator.init();

            resolve();
          })
          .catch((e) => reject(e));
      }
    });
  }

  // TODO change this to serviceS
  public service(serviceRequest: ServiceRequest): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      if (!this.started) {
        return reject('Workspace not started yet');
      }

      const service = this.serviceRegistry[serviceRequest.serviceName];
      // console.log('registry', this.serviceRegistry);

      return !service
        ? reject(`Service not found: ${serviceRequest.serviceName}`)
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
