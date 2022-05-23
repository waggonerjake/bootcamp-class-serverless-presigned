const AWS = require('aws-sdk')
const s3 = new AWS.S3({signatureVersion: 'v4'}) //Use the sigv4 algorithm when generating the pre-signed URL

exports.handler = async (event) => {
  const filename = event.queryStringParameters.filename; //Grab the query parameter called 'filename' from the API Gateway event to lambda
  const TTL = 300;
  //S3 options that are used when generating the Pre-signed URL
  const s3Params = {
    Bucket: process.env.BUCKET_NAME, //What bucket we want to generate the pre-signed URL for
    Key: filename, //The name of the object we want to generate the pre-signed URL for
    Expires: TTL, //How long, in seconds, the pre-signed URL is valid for
    ContentType: 'application/pdf', //A header that must be included when uploading the document using the pre-signed URL
  }

  let uploadURL;
  try{
    uploadURL = await s3.getSignedUrlPromise('putObject', s3Params) //AWS S3 API Call to generate the pre-signed URL
  } catch(e) {
    console.log(e);
  }

  //To return your own message from lambda to API Gateway, it needs to have a statusCode field and a body field.
  return {
    statusCode: 200, //Set a 200 status
    body: JSON.stringify({
      uploadURL: uploadURL, //Return the pre-signed URL
      filename: filename, //The filename the file will be saved as in our S3
      validFor: `${TTL} seconds` //The time the URL is valid for
  })}
}