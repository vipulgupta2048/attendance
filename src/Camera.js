import React from "react";
import Webcam from "react-webcam";
var base64Img = require("base64-img");
var VisualRecognitionV3 = require("ibm-watson/visual-recognition/v3");

const visualRecognition = new VisualRecognitionV3({
  version: "2018-03-19",
  disable_ssl_verification: true,
  iam_apikey: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
});

class Camera extends React.Component {
  state = {
    imageData: null,
    image: []
  };

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      imageData: imageSrc
    });
    var filepath = base64Img.imgSync(imageSrc, "", "2");
    console.log(filepath);
  };

  onClickRetake = e => {
    e.persist();
    this.setState({
      imageData: null
    });
  };

  onClickUpload = () => {
    var images_file = "./2.jpg";
    var classifier_ids = ["DefaultCustomModel_869488859"];
    var threshold = 0.75;
    var params = {
      images_file: images_file,
      classifier_ids: classifier_ids,
      threshold: threshold
    };
    visualRecognition.classify(params, function(err, response) {
      if (err) {
        console.log(err);
      } else {
        console.log(JSON.stringify(response, null, 2));
      }
    });
    // const detectFacesParams = {
    //   images_file: this.state.imageData
    // };
    // visualRecognition
    //   .detectFaces(detectFacesParams)
    //   .then(detectedFaces => {
    //     console.log(JSON.stringify(detectedFaces, null, 2));
    //   })
    //   .catch(err => {
    //     console.log("error:", err);
    //   });
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
