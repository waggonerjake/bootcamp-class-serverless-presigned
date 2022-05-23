const app = require('../../app'); //Import the file we want to test

test('A pre-signed URL', async () => { //Create the test handler, takes a string and a function as args
  app.s3Handler.getSignedUrlPromise = jest.fn(() => Promise.resolve("https://test.com")); //Mock the pre-signed URL call so we do not have to actually make an AWS call
  const event = {  // Create a test event we will pass into the function
    queryStringParameters: { //We need queryParameters in our event
      filename: 'test.pdf' //We set the filename queryparameter to be 'test.pdf', just like a real GET request
    }
  }
  const actual = await app.handler(event); //Call the function
  expect(actual).toEqual({ //Have an assertion where we compare what we got to what we expect
    statusCode: 200, //Should return a 200 OK
    body: JSON.stringify({ //Should return a JSON string as the body
      uploadURL: 'https://test.com', //Pre-signed URL is test.com since thats what we mocked it to on line 4
      filename: 'test.pdf', //Filename is test.pdf since thats the query parameter we passed in
      validFor: '300 seconds' //The validFor should be equal to the TTL we set in the code
  })});
});