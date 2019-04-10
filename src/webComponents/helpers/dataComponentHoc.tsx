import * as React from 'react';

export const dataComponentHoc = (Component: any, data$: any) => {
  return class HOC extends React.Component {
    public state;

    constructor(props) {
      super(props);
      this.state = undefined;
    }

    public componentDidMount() {
      data$.subscribe((data) => {
        // @ts-ignore
        this.setState(data);
      });
    }

    public render() {
      if (!this.state) {
        return null;
      }
      // @ts-ignore
      return <Component {...this.state} />;
    }
  };
};
