const AWS = require('aws-sdk')
const s3 = new AWS.S3({signatureVersion: 'v4'})

exports.handler = async (event) => {
  const filename = event.queryStringParameters.filename;
  const TTL = 300;
  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Expires: TTL,
    ContentType: 'application/pdf',
  }

  let uploadURL;
  try{
    uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)
  } catch(e) {
    console.log(e);
  }

  return {
    statusCode: 200, 
    body: JSON.stringify({
      uploadURL: uploadURL,
      filename: filename,
      validFor: `${TTL} seconds`
  })}
}

exports.s3Handler = s3;