const Ajv = require('ajv'); // validate Json Schema

// Validate payload using AJV
exports.validateAJV = function (payload, schema) {
  let ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(payload);
  return valid;
};

exports.generateResponse = (statusCode, custom_headers, body, isBase64Encoded = false) => {
  let default_headers = {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };

  let response = {
    statusCode: parseInt(statusCode),
    body: JSON.stringify(body),
    headers: { ...default_headers, ...custom_headers },
    isBase64Encoded: isBase64Encoded,
  };

  return response;
};
