// Service that register itself, expose hello and expose helloToParrot that requires ParrotService from workspace
export class GreetingService {
  public static hello() {
    return Promise.resolve('Hello');
  }

  public helloToParrot(helloToParrotRequest: string) {
    return (window as any)['workspace']
      .service({ serviceName: 'ParrotService' })
      .repeat('Hello' + helloToParrotRequest);
  }
}
