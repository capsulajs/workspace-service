import * as React from 'react';

export const dataComponentHoc = (Component: any, data$: any) => {
  return class HOC extends React.Component {
    public componentDidMount() {
      data$.subscribe((data) => {
        this.setState(data);
      });
    }

    public render() {
      if (!this.state) {
        return null;
      }

      return <Component {...this.state} />;
    }
  };
};
