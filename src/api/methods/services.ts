export interface ServicesRequest {}

export interface Service {
  serviceName: string;
  displayName: string;
  proxy: any;
}

export interface ServicesResponse {
  [displayName: string]: Service;
}
