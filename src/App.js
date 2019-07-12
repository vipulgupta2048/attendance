import React from "react";
import Camera from "./Camera";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="attendance">
        <h1>Scan for Attendance</h1>
        <Camera />
      </div>
    );
  }
}

export default App;
