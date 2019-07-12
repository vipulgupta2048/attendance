import React from "react";
import Webcam from "react-webcam";
// var base64ToImage = require("base64-to-image");
var VisualRecognitionV3 = require("ibm-watson/visual-recognition/v3");

const visualRecognition = new VisualRecognitionV3({
  version: "2018-03-19",
  disable_ssl_verification: true,
  iam_apikey: "s5WVbUWhmLuHMHI10NQ5eT43vElm-RCDjIkUxfM78OFf"
});

class Camera extends React.Component {
  state = {
    imageData: null,
    url: ""
  };

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      imageData: imageSrc
    });

    //  FIX THISSS
    // base64Img.img(this.state.imageData, "", "1", function(err, filepath) {});


  onClickRetake = e => {
    e.persist();
    this.setState({
      imageData: null
    });
  };

  onClickUpload = () => {
    const detectFacesParams = {
      images_file: this.state.imageData
    };

    visualRecognition
      .detectFaces(detectFacesParams)
      .then(detectedFaces => {
        console.log(JSON.stringify(detectedFaces, null, 2));
      })
      .catch(err => {
        console.log("error:", err);
      });
  };

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
          </div>
        ) : null}
      </div>
    );
  }
}

export default Camera;
