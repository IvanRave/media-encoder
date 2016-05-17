Encode
===

Amazon Elastic Transcoder lets you convert digital media stored in Amazon S3 into the audio and video codecs and the containers required by consumer playback devices. For example, you can convert large, high-quality digital media files into formats that users can play back on mobile devices, tablets, web browsers, and connected televisions.


Definitions
---

- **Pipelines** are queues that manage your transcoding jobs.
- **Jobs** specify the settings that aren’t included in the preset.
- **Presets** are templates that specify most of the settings for the transcoded media file.


Prepare
---

- Create an IAM user, receive credentials
- Save credentials as environment variables
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
- Create a pipeline: https://console.aws.amazon.com/elastictranscoder/home
- Add permissions to this user: full access to this pipeline


Usage
---

see example


Links
---

- [AWS SDK for Node.js](http://aws.amazon.com/ru/sdk-for-node-js/)
- [Configuring the SDK in Node.js: credentials, region, etc.](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
- [API docs for Elastic Transcoder](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticTranscoder.html)
- [Error handling for jobs](http://docs.aws.amazon.com/elastictranscoder/latest/developerguide/error-handling.html)