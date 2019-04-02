// Service that require token, register itself and expose repeat method
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

export class ParrotService {
  token: string;

  constructor(token: string) {
    this.token = token;

    // TODO It seems like a problem that have an async call here
    // (window as any)['workspace'].register({
    //   serviceName: 'ParrotService',
    //   displayName: 'Parrot',
    // })
  }

  public repeat(repeatRequest: any) {
    return Promise.resolve({ response: repeatRequest, token: this.token });
  }
}
