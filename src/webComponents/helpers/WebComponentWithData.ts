import { Observable } from 'rxjs';

export default class WebComponentWithData extends HTMLElement {
  public state$?: Observable<any>;
  constructor(private servises: any) {
    super();
  }

  public setState() {


    this.state$ = callback(this.servises);
  }
}
