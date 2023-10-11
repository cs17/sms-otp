const helper = require('../_lib/util/helper.js');
const dynamoDB = require('../_lib/aws/dynamodb.js');
var bodySchema = require('./_schema/bodySchema.json');

exports.handler = async (event, context) => {
  try {
    // (1) Extract payload body
    let payload;
    if (event.isBase64Encoded) {
      console.log('isBase64Encoded:' + event.isBase64Encoded);
      let pb = Buffer.from(event.body, 'Base64').toString();
      payload = JSON.parse(pb);
    } else {
      // payload = JSON.parse(event.body);
      payload = event.body;
    }
    // console.log('Body (JSON):', payload);

    // (2) validate Schema
    if (!helper.validateAJV(payload, bodySchema)) {
      return helper.generateResponse(400, {}, 'Bad Request', false);
    }

    // (3) Retrieve OTP from AWS DynamoDB and validate

    let dynamoDB_get_params = {
      TableName: process.env.DynamoDB_TableName,
      Key: {
        otp: payload.otp,
      },
    };
    let tmpRecord = await dynamoDB.get(dynamoDB_get_params);
    let record = tmpRecord.Item;

    // (4) Validate the OTP, appID & UUID
    if (
      record?.uuid === payload.uuid &&
      record?.appID === payload.appID &&
      record?.otp === payload.otp
    ) {
      return helper.generateResponse(200, {}, { result: true }, false);
    } else {
      return helper.generateResponse(403, {}, { result: false }, false);
    }
    // (5) Response the validation result
  } catch (error) {
    console.log('Encountered error:', error);
    return helper.generateResponse(500, {}, 'Internal Server Error', false);
  }
};
