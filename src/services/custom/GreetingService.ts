import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

// Service that register itself, expose hello and expose helloToParrot that requires ParrotService from workspace
export class GreetingService {
  public hello() {
    return Promise.resolve('Hello');
  }

  public helloToParrot(helloToParrotRequest: string) {
    return (window as any).workspace
      .service({ serviceName: 'ParrotService' })
      .then((parrot) => parrot.proxy.repeat('Hello' + helloToParrotRequest))
      .catch((e) => {
        throw new Error(e);
      });
  }

  public helloToCount(name: string) {
    return interval(1000).pipe(map((num: number) => `Hello ${name} times ${num}`));
  }
}
