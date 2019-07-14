var express = require("express");
var router = express.Router();
var VisualRecognitionV3 = require("ibm-watson/visual-recognition/v3");
var fs = require("fs");
var cors = require("cors");
var myParser = require("body-parser");
var qs = require("qs");
var base64Img = require("base64-img");
var base64ToImage = require("base64-to-image");
var app = express();
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());
// app.post("/users", function(request, response) {
//   console.log(request.body); //This prints the JSON document received (if it is a JSON document)
// });

router.post("/", function(req, res, next) {
  //   console.log(qs.parse(req.body));
  //   console.log(JSON.stringify(req.body.data));
  var data = req.body.data;
  //console.log(data);
  //   var optionalObj = { fileName: "imageFileName", type: "jpeg" };
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
  //console.log(imageBuffer);
  //fs.writeFile("/home/akshat0047/test.jpeg", imageBuffer);
  //   console.log(data);
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
          //   response.json(err);
        } else {
          console.log(JSON.stringify(response, null, 2));
          //   res.json(response);
          //   app.set("data", JSON.stringify(response, null, 2));
        }
      });
    });
  } catch (error) {
    console.log("ERROR:", error);
  }
}

/*
  var visualRecognition = new VisualRecognitionV3({
    version: "2018-03-19",
    disable_ssl_verification: true,
    iam_apikey: "s5WVbUWhmLuHMHI10NQ5eT43vElm-RCDjIkUxfM78OFf"
  });
  var images_file = fs.createReadStream("/home/vipulgupta2048/Desktop/a.jpg");
  var classifier_ids = ["DefaultCustomModel_869488859"];

  var params = {
    images_file: images_file,
    classifier_ids: classifier_ids
  };

  visualRecognition.classify(params, function(err, response) {
    if (err) {
      console.log(err);
      //   response.json(err);
    } else {
      console.log(JSON.stringify(response, null, 2));
      //   res.json(response);
      //   app.set("data", JSON.stringify(response, null, 2));
    }
  });
}

// router.get("/", function(req, res, next) {
//   res.json(app.get("data"));
// });

//   base64ToImage(x, "/", optionalObj);
//   var imageBuffer = decodeBase64Image(data);
//   fs.writeFile("./home/vipulgupta2048/Desktop/test.jpg", imageBuffer.data);
*/
module.exports = router;
