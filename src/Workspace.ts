import { Microservices } from '@scalecube/scalecube-microservice';
import { Service } from '@scalecube/scalecube-microservice/lib/api';
import { Workspace as WorkspaceInterface } from './api/Workspace';
import { StartRequest } from './api/methods/start';
import { ServicesRequest, ServicesResponse } from './api/methods/services';
import { ServiceRequest, ServiceResponse } from './api/methods/service';
import { RegisterRequest } from './api/methods/register';
import { RegisterComponentRequest } from './api/methods/registerComponent';
import { Orchestrator } from './services/core/Orchestrator';
import { Layout } from './services/core/Layout';
import Grid from './webComponents/Grid';
import EnvDropdown from './webComponents/EnvDropdown';
import MethodCatalog from './webComponents/MethodCatalog';
import { ComponentsMap } from './api/methods/components';
import { RegisteredService } from './types';
import { prepareWebComponent } from './helpers';

const componentModules = {
  ['http://cdn.components/Grid.tsx']: Grid,
  ['http://cdn.components/EnvDropdown.tsx']: EnvDropdown,
  ['http://cdn.components/MethodCatalog.tsx']: MethodCatalog,
};

export class Workspace implements WorkspaceInterface {
  private readonly token: string;
  private readonly serviceRegistry: { [serviceName: string]: RegisteredService };
  private readonly componentRegistry: ComponentsMap;
  private config: any;
  private started: boolean;
  private microservice: any;

  constructor(args: { token: string; config: any }) {
    this.token = args.token;
    this.config = args.config;
    this.serviceRegistry = {};
    this.componentRegistry = {};
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
          });
        });

        Promise.all(services as Array<Promise<Service>>)
          .then(async (s) => {
            this.microservice = Microservices.create({ services: s });

            await Promise.all(
              this.config.components.componentsBeforeLoad.map(({ name, nodeSelector, path }) => {
                return prepareWebComponent({ name, path, componentModules }).then((webComponent) =>
                  this.registerComponent({ componentName: name, nodeSelector, reference: webComponent })
                );
              })
            );

            await Promise.all(
              this.config.components.componentsAfterLoad.map(({ name, nodeSelector, path }) => {
                return prepareWebComponent({ name, path, componentModules }).then((webComponent) =>
                  this.registerComponent({ componentName: name, nodeSelector, reference: webComponent })
                );
              })
            );

            // Init layout
            const layout = new Layout({ token: this.token });
            layout.render().catch((error: Error) => {
              throw new Error(`Error while rendering layout: ${error.message}`);
            });

            // Init orchestrator
            const orchestrator = new Orchestrator(this.token);
            orchestrator.init();

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

      const services = Object.values(this.serviceRegistry).reduce((service, serviceData) => {
        return {
          ...service,
          [serviceData.displayName]: {
            serviceName: serviceData.serviceName,
            displayName: serviceData.displayName,
            proxy: this.microservice.createProxy({ serviceDefinition: serviceData.definition }),
          },
        };
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

  public registerComponent(registerComponentRequest: RegisterComponentRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const component = this.componentRegistry[registerComponentRequest.componentName];

      if (!!component) {
        reject('Component already registered');
      } else {
        this.componentRegistry[registerComponentRequest.componentName] = { ...registerComponentRequest };
        resolve();
      }
    });
  }

  public components(): ComponentsMap {
    return this.componentRegistry;
  }
}
