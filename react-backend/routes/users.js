var express = require("express");
var router = express.Router();
var VisualRecognitionV3 = require("ibm-watson/visual-recognition/v3");
var fs = require("fs");
var myParser = require("body-parser");
var Jimp = require("jimp");

var app = express();

app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());

router.post("/", function(req, res, next) {
  var data = req.body.data;
  request(data);
});

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = Buffer.from(matches[2], "base64");

  return response;
}

//  Face Detection
function identification(visualRecognition, params) {
  visualRecognition.detectFaces(params, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Request sent, Face identified");
      var height = response.images[0].faces[0].face_location.height;
      var width = response.images[0].faces[0].face_location.width;
      var left = response.images[0].faces[0].face_location.left;
      var top = response.images[0].faces[0].face_location.top;
      Jimp.read("test.jpeg")
        .then(test => {
          console.log("Face Cropped and stored");
          return test.crop(left, top, width, height).write("test.jpeg"); // save
        })
        .catch(err => {
          console.error(err);
        });
    }
  });
}

//  Face Recognition
function recognition(visualRecognition, params) {
  visualRecognition.classify(params, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("identifying faces");
      console.log(response.images[0].classifiers[0].classes[0].class);
      console.log(response.images[0].classifiers[0].classes[0].score);
      app.set("class", response.images[0].classifiers[0].classes[0].class);
      app.set("score", response.images[0].classifiers[0].classes[0].score);
    }
  });
}

function request(data) {
  var imageBuffer = decodeBase64Image(data);
  var filepath = "test.jpeg";
  try {
    fs.writeFile(filepath, imageBuffer.data, function() {
      var visualRecognition = new VisualRecognitionV3({
        version: "2018-03-19",
        disable_ssl_verification: true,
        iam_apikey: "s5WVbUWhmLuHMHI10NQ5eT43vElm-RCDjIkUxfM78OFf"
      });

      var images_file = fs.createReadStream(filepath);
      var params = {
        images_file: images_file
      };
      identification(visualRecognition, params);
      var images_file = fs.createReadStream(filepath);
      var classifier_ids = ["DefaultCustomModel_869488859"];
      var params = {
        images_file: images_file,
        classifier_ids: classifier_ids
      };
      recognition(visualRecognition, params);
    });
  } catch (error) {
    console.log("ERROR:", error);
  }
}

router.get("/", function(req, res, next) {
  res.json([
    {
      id: 1,
      name: app.get("class"),
      score: app.get("score")
    }
  ]);
});

module.exports = router;
