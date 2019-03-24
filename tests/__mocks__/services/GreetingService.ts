// Service that register itself, expose hello and expose helloToParrot that requires ParrotService from workspace
export class GreetingService {
  public hello() {
    return Promise.resolve('Hello');
  }

  public helloToParrot(helloToParrotRequest: string) {
    return (window as any)['workspace'].service({ serviceName: 'ParrotService' })
      .then(parrot => parrot.proxy.repeat('Hello' + helloToParrotRequest))
      .catch(e => console.log(e));
  }
}
