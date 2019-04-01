import * as React from 'react'

export const dataComponentHoc = (Component: any, data$: any) => {
  return class HOC extends React {
    public state = {};

    public componentDidMount() {
      data$.subscribe((data) => {
        // @ts-ignore
        this.setState(data)
      })
    }

    public render() {
      // @ts-ignore
      // @tslint-disable
      return (<Component {...this.state} />)
    }

  }
}
