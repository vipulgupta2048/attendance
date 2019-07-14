import React from "react";
import Webcam from "react-webcam";
const axios = require("axios");
var qs = require("qs");

class Camera extends React.Component {
  state = {
    imageData: null,
    image: [],
    data: []
  };

  comppnentDidMount() {
    fetch("/users")
      .then(res => res.json())
      .then(users => this.setState({ data: users }));
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      imageData: imageSrc
    });
    axios({
      method: "POST",
      url: "http://localhost:3100/users",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      data: qs.stringify({ data: imageSrc })
    });
  };

  onClickRetake = e => {
    e.persist();
    this.setState({
      imageData: null
    });
  };

  onClickUpload = () => {};

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
    return (
      <div>
        <Webcam
          audio={false}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
        <button onClick={this.capture}>Capture photo</button>
        {this.state.imageData ? (
          <div>
            <p>
              <img src={this.state.imageData} alt="" />
            </p>
            <span>
              <button onClick={this.onClickUpload}>Mark Attendance!</button>
            </span>
            <span>
              <button onClick={this.onClickRetake}>Retake Picture</button>
            </span>
            {this.state.data ? (
              <div>
                <p>
                  Welcome {this.state.data.name}, to Amity University. YOu have
                  been marked present for the day.
                </p>
                <p>
                  If this is not you, please retake the picture or call the IT
                  department!
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export default Camera;
