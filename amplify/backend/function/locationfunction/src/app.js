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
const { v4: uuidv4 } = require('uuid')
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient();

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


function getId(){
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}


app.get("/location", function (request, response) {
  const tableName = "locationtable1";
  let params = {
    TableName: tableName ||  process.env.STORAGE_DYNAMODB_NAME,
    limit: 100
  }
  dynamodb.scan(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Items) })
    }
  });
});


app.post("/location", function (request, response) {
  const tableName = "locationtable1";
  const timestamp = new Date().toISOString();
  const query = request.query;
  let params = {
    TableName: tableName || process.env.STORAGE_DYNAMODB_NAME,
    Item: {
      ...request.body,
      id: uuidv4(),               // auto-generate id
      createdAt: timestamp,
      updatedAt: timestamp,
      iss_position: 
        { 
          "longitude": query.iss_position.longitude, 
          "latitude": query.iss_position.latitude
        }, 	
      timestamp: query.time, 
      message: query.message
    }
  }
  dynamodb.put(params, (error, result) => {
    if (error) {
      console.error("############Params JSON:", JSON.stringify(error.message, null, 2));
      response.json({ statusCode: 500, error: error.message, url: request.url });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(params.Item) })
    }
  });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;