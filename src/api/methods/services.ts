export interface ServicesRequest {}

export interface Service {
  serviceName: string;
  proxy: any;
}

export interface ServicesMap {
  /** Each promise will be resolved when the corresponding service will be registered */
  [serviceName: string]: Promise<Service>;
}
