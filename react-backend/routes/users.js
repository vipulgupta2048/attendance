var express = require("express");
var router = express.Router();
var VisualRecognitionV3 = require("ibm-watson/visual-recognition/v3");
var fs = require("fs");
var myParser = require("body-parser");
var app = express();
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());

router.post("/", function(req, res, next) {
  var data = req.body.data;
  request(data);
});

function request(data) {
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
      var classifier_ids = ["DefaultCustomModel_869488859"];

      var params = {
        images_file: images_file,
        classifier_ids: classifier_ids
      };

      visualRecognition.classify(params, function(err, response) {
        if (err) {
          console.log(err);
        } else {
          console.log(JSON.stringify(response, null, 2));
        }
      });
    });
  } catch (error) {
    console.log("ERROR:", error);
  }
}

module.exports = router;
