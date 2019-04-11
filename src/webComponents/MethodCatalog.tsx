import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, combineLatest, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Catalog } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';
import { mapServices } from './helpers/mapServices';

interface MethodCatalogProps {
  items: any[];
  selected: any;
  select: (request: { key: { envKey: 'string' } }) => void;
}

class MethodCatalogUI extends React.Component {
  public render() {
    const { methods, selectMethod } = this.props;
    const mappedMethods = mapServices(methods);

    if (!mappedMethods[0].children[0]) {
      return 'No services ..';
    }

    return (
      <Catalog
        methods={mappedMethods}
        selectedMethod={mappedMethods[0].children[0].children[0]}
        selectMethod={this.handleOnChange}
      />
    );
  }

  private handleOnChange = ({ name }) => console.log('Selected Method: ', name);
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
        return combineLatest(methodSelectorService.output$({}), methodSelectorService.selected$({})).pipe(
          map((data) => ({ methods: data[0], selectedMethod: data[1], selectMethod: methodSelectorService.select }))
        );
      }),
      tap((response) => console.log('response from MethodSelectorService', response))
      // startWith({
      //   selected: {},
      //   items: [],
      //   select: () => {},
      // })
    );
  }
}
