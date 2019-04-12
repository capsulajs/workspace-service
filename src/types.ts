export interface RegisteredService {
  serviceName: string;
  displayName: string;
  definition: any;
}


export type EventType = 'request' | 'response';
export interface LoggerEvent {
  timestamp: number;
  correlationId: number;
  type: LoggerEventType;
  serviceName: string;
  methodName: string;
  request: object;
  response: object;
}
