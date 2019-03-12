// Service that doesn't register itself and include tellMeASecret method that requires ParrotService from workspace
export class SecretService {
  public async tellMeASecret() {
    return (window as any)['workspace']
      .service({ serviceName: 'ParrotService' })
      .repeat(42)
      .then((parrot: any) => "If you say 42 to Parrot, he'll tell you that the token is " + parrot.token);
  }
}
