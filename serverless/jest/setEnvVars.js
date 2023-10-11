process.env.STAGE = 'dev';
process.env.ImagesHostURL = 'http://localhost:3000/dev/retrieve'; // DO NOT include (/) at the end
process.env.ImagesTableName = 'Images'; // AWS DynamoDB Table Name
process.env.ImagesBucketName = 'images-bucket'; // AWS S3 Bucket Name
