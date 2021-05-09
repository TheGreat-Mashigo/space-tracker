/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient();

function getId(){
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

app.get("/location", function (req, res) {

  // let locations = await Article.findAll().exec();
  var params = {
    TableName: table,
};

docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    }
});
});


app.post("/location", function (req, res) {
  // Add your code here
  const query = req.query;
  console.log("req: ", query);
  console.log("res: ", res);
  const id = getId();
  var params = {
    TableName = process.env.STORAGE_DYNAMODB_NAME,
    Item: {
      id: id,
      iss_position: 
        { 
          "longitude": query.iss_position.longitude, 
          "latitude": query.iss_position.latitude
        }, 	
      timestamp: query.time, 
      message: query.message
    }
  }
  docClient.put(params, function(err, data) {
    if(err) {
      console.error("Unable to post item. Error JSON:", JSON.stringify(err, null, 2));
      res.json({err});
    }else{
      res.json({success: 'Coordinates updated', url: req.url})
    }
  });
  // res.json({
  //   event: req.apiGateway.event, // to view all event data
  //   query: query
  // });
  // res.json({ success: "get call succeed!", url: req.url });
});


app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
