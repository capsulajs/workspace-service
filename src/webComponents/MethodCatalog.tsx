import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, from } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Catalog } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import { mapServiceMethods } from './helpers/mapServiceMethods';

interface MethodCatalogProps {
  methods: any[];
}

interface MethodCatalogState {
  selectMethod?: object;
}

class MethodCatalogUI extends React.Component<MethodCatalogProps, MethodCatalogState> {
  public state = {
    selectMethod: undefined,
  };

  public render() {
    const { selectMethod } = this.state;
    const { methods } = this.props;

    if (methods.length === 0) {
      return 'No services ..';
    }

    return (
      <Catalog methods={mapServiceMethods(methods)} selectedMethod={selectMethod} selectMethod={this.handleOnChange} />
    );
  }

  private handleOnChange = (method) => this.setState(method);
}

const mountPoint = 'method-catalog';

class MethodCatalog extends HTMLElement {
  public props$?: Observable<any>;

  constructor() {
    super();
    this.innerHTML = `<div id=${mountPoint}></div>`;
  }

  public connectedCallback() {
    const Component: any = this.props$ ? dataComponentHoc(MethodCatalogUI, this.props$) : MethodCatalogUI;
    ReactDOM.render(<Component />, document.getElementById(mountPoint));
  }
}

export default class CatalogWithData extends MethodCatalog {
  private setState() {
    this.props$ = from(window.workspace.service({ serviceName: 'MethodSelectorService' })).pipe(
      map((serviceData) => serviceData.proxy),
      switchMap((methodSelectorService) => {
        return methodSelectorService.output$({}).pipe(map((methods) => ({ methods })));
      }),
      startWith({
        methods: [],
      })
    );
  }
}
