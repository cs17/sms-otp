let AWS;

if (process.env._X_AMZN_TRACE_ID || process.env.AWS_XRAY_CONTEXT_MISSING) {
  AWS = require('aws-xray-sdk-core').captureAWS(require('aws-sdk'));
} else {
  console.log('Serverless Offline detected; skipping AWS X-Ray setup');
  AWS = require('aws-sdk');
}

AWS.config.maxRetries = 2;
const dbClient = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'MockAccessKeyId', // needed if you don't have aws credentials at all in env
  secretAccessKey: 'MockSecretAccessKey', // needed if you don't have aws credentials at all in env
});

// exports.scan = async function (params) {
//   let scanResults = [];
//   let result;
//   do {
//     result = await dbClient.scan(params).promise();
//     scanResults.push(...result.Items);
//     params.ExclusiveStartKey = result.LastEvaluatedKey;
//   } while (typeof result.LastEvaluatedKey != 'undefined');

//   return { Items: scanResults };
// };

// exports.query = async function (params) {
//   let queryResults = [];
//   let items;
//   do {
//     items = await dbClient.query(params).promise();
//     items.Items.forEach((item) => queryResults.push(item));
//     params.ExclusiveStartKey = items.LastEvaluatedKey;
//   } while (typeof items.LastEvaluatedKey != 'undefined');

//   return { Items: queryResults };
// };

exports.put = function (params) {
  return dbClient.put(params).promise();
};

exports.get = function (params) {
  return dbClient.get(params).promise();
};

// exports.delete = function (params) {
//   return dbClient.delete(params).promise();
// };

// exports.update = function (params) {
//   return dbClient.update(params).promise();
// };
