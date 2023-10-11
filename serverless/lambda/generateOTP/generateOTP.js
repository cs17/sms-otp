const helper = require('../_lib/util/helper.js');
const dynamoDB = require('../_lib/aws/dynamodb.js');
var bodySchema = require('./_schema/bodySchema.json');
const otpGenerator = require('otp-generator');

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

    // (2) validate Schema
    if (!helper.validateAJV(payload, bodySchema)) {
      return helper.generateResponse(400, {}, 'Bad Request', false);
    }

    // (3) Generate OTP
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // (4) Store the OTP in DynamoDb
    let dynamoDB_put_params = {
      TableName: process.env.DynamoDB_TableName,
      Item: {
        uuid: payload.uuid,
        appID: payload.appID,
        otp: OTP.toString(), // to support future upgrade to support OTP that contains alphanumeric
      },
    };
    await dynamoDB.put(dynamoDB_put_params);

    // (5) Response OTP
    return helper.generateResponse(200, {}, { otp: OTP }, false);
  } catch (error) {
    console.log('Encountered error:', error);
    return helper.generateResponse(500, {}, 'Internal Server Error', false);
  }
};
