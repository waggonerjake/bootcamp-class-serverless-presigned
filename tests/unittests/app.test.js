const app = require('../../app');

test('A pre-signed URL', async () => {
  app.s3Handler.getSignedUrlPromise = jest.fn(() => Promise.resolve("https://test.com"));
  const event = {
    queryStringParameters: {
      filename: 'test.pdf'
    }
  }
  const actual = await app.handler(event);
  expect(actual).toEqual({
    statusCode: 200, 
    body: JSON.stringify({
      uploadURL: 'https://test.com',
      filename: 'test.pdf',
      validFor: '300 seconds'
  })});
});