import React from "react";
import ReactDOM from "react-dom";
import styles from "./index.less";

class App extends React.PureComponent {
  render() {
    return <h1 className={styles.title}>Hello,Trust Scripts!!!</h1>;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
