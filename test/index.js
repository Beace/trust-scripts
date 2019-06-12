import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';

class AppTest extends React.Component {
  render() {
    return (
      <div>Hello, Trust Scripts!!</div>
    )
  }
}

ReactDOM.render(<AppTest />, document.getElementById('root-test'));