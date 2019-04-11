import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Observable, combineLatest, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Catalog } from '@capsulajs/capsulahub-ui';
import { dataComponentHoc } from './helpers/dataComponentHoc';

interface MethodCatalogProps {
  items: any[];
  selected: any;
  select: (request: { key: { envKey: 'string' } }) => void;
}

class MethodCatalogUI extends React.Component {
  public render() {
    return (
      <div>
        Test
        {/*<Catalog title="Environments" items={items} onChange={this.handleOnChange} />*/}
        {/*<p>OUTPUT:</p>*/}
        {/*{!selected.envKey && <p>No env has been selected</p>}*/}
        {/*{selected.envKey && (*/}
        {/*  <div style={{ padding: 20 }}>*/}
        {/*    <div>*/}
        {/*      ENV[{selected.envKey}]: {JSON.stringify(selected.env || {})}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    );
  }

  // private handleOnChange = ({ label }) => {
  //   this.props.select({ key: { envKey: label } });
  // };
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
