# SMS OTP

## Description:

This demo application illustrate 2 APIs (/generateOTP and /validateOTP) that allow our client to perform these actions:

- **Generate OTP** - It allows our client to generate an OTP for an UUID with AppID. The API will store the OTP into AWS DynamoDB. AN OTP will return in the API response.

- **Validate OTP** - It allows our client to validate the OTP from previous API.

The underlying APIs are developed using:

- AWS Lambda, API Gateway, and DynamoDB (Local).
- NodeJS / NPM
- Serverless Framework (https://www.serverless.com/). It allows us to quickly deploy to AWS or other CSPs (Cloud Service Providers) using a single framework.

---

## Usage:

### A. (Pre - One time setup) Setup Docker For AWS DynamoDb

1. Download Docker Destop (Ref: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html#docker)
2. Go to file `docker-compose.yml` located in `sms-otp/local-dynamoDb-docker`, run this command in the same directory:
   ```
   docker-compose up
   ```
3. Test the connection to AWS DynamoDB, run this command in your CLI:

   ```
   aws dynamodb list-tables --endpoint-url http://localhost:8000
   ```

   You should be see the result as this,

   ```
   {
    "TableNames": []
   }
   ```

4. Create table for `otp_table` in DynamoDB, run this command in your CLI:

   ```
   aws dynamodb create-table --endpoint-url http://localhost:8000 \
   --table-name otp_table \
   --attribute-definitions \
       AttributeName=otp,AttributeType=S \
   --key-schema AttributeName=otp,KeyType=HASH \
   --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
   ```

5. Create two(2) records in `otp_table` table, run this command in your CLI:

   ```
   aws dynamodb put-item --endpoint-url http://localhost:8000 \
   --table-name otp_table \
   --item \
       '{"otp": {"S": "123456"}, "appId": {"S": "CS-DEMO-APP-001"}, "uuid":{"S":"db6336f0-65a8-49df-b1ff-8c019e5a0d6a"}}' \
   --return-consumed-capacity TOTAL
   ```

   and,

   ```
   aws dynamodb put-item --endpoint-url http://localhost:8000 \
   --table-name otp_table \
   --item \
       '{"otp": {"S": "654321"}, "appId": {"S": "CS-DEMO-APP-001"}, "uuid":{"S":"1ea8ab4e-ade7-4012-9d26-d355be05e5b1"}}' \
   --return-consumed-capacity TOTAL
   ```

6. Scan entire table.

   ```
   aws dynamodb scan --endpoint-url http://localhost:8000 --table-name otp_table
   ```

7. (Do not execute) Delete the entire table in AWS DynamoDB if needed.
   ```
    aws dynamodb delete-table --endpoint-url http://localhost:8000 \
        --table-name otp_table
   ```

### B. Setup Serverless

1. Setup local Docker for AWS DynamoDB, please refer to _Step A. (Pre - One time setup) Setup Docker For AWS DynamoDb_ below.

2. Install Serverless

   ```
   npm i -g serverless
   ```

3. Go to `sms-otp/serverless`, run npm install

   ```
   npm install
   ```

---

### C. Test the APIs

#### (A) Generate OTP

1. Go to your terminal, cd into `sms-otp/serverless/lambda`, run the following commands:

   ```
   // Good
   serverless invoke local --function generateOTP --data '{"body": {"uuid": "ef9b08ff-cde3-4db1-aeb6-e00b820705c7","appID": "CS-DEMO-APP-002"}}'
   ```

   You shall the the terminal response with the OTP:

   ```
   {
    "statusCode": 200,
    "body": "{\"otp\":\"715354\"}",
    "headers": {
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
    },
    "isBase64Encoded": false
   }
   ```

   You can try the negative testing as below:

   ```
   // Invalid Schema:
   serverless invoke local --function generateOTP --data '{"body": {"uuid": "ef9b08ff-cde3-4db1-aeb6-e00b820705c7","xxxxx": "CS-DEMO-APP-002"}}'
   ```

#### (B) Validate OTP

1. Go to your terminal, cd into `sms-otp/serverless/lambda`, run the following commands:

   ```
   // Good
   serverless invoke local --function validateOTP --data '{"body": {"uuid": "ef9b08ff-cde3-4db1-aeb6-e00b820705c7","appID": "CS-DEMO-APP-002", "otp":"??????"}}'
   ```

   **Note**: The OTP can get from the step earlier

   You shall the the terminal response with the OTP:

   ```
   {
    "statusCode": 200,
    "body": "{\"result\":true}",
    "headers": {
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
    },
    "isBase64Encoded": false
   }

   ```

   You can try the negative testing as below:

   ```
   //Wrong OTP:
   serverless invoke local --function validateOTP --data '{"body": {"uuid": "ef9b08ff-cde3-4db1-aeb6-e00b820705c7","appID": "CS-DEMO-APP-002", "otp":"000000"}}'

   // Invalid Schema:
   serverless invoke local --function validateOTP --data '{"body": {"uuid": "ef9b08ff-cde3-4db1-aeb6-e00b820705c7","xxxx": "CS-DEMO-APP-002", "otp":"000000"}}'
   ```
