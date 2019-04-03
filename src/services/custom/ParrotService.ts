// Service that require token, register itself and expose repeat method

export class ParrotService {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  public repeat(repeatRequest: any) {
    return Promise.resolve({ response: repeatRequest, token: this.token });
  }
}
