// src/components/Example.tsx
import React from 'react';

type Props = {};
type State = { count: number };

class Example extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { count: 0 };
  }
  render() {
    return <div>Count: {this.state.count}</div>;
  }
}

export default Example;
