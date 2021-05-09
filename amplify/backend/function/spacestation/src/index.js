const awsServerlessExpress = require("aws-serverless-express");
const app = require("./app");

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  console.log(event.queryStringParameters);
  console.log("body: ", event.body);
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
