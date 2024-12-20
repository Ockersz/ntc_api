const AWS = require("aws-sdk");

require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sqs = new AWS.SQS();
const queueUrl = process.env.EMAIL_QUEUE_URL;

async function sendEmailToQueue(subject, body, recipient) {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({ subject, body, recipient }),
  };

  try {
    await sqs.sendMessage(params).promise();
    console.log("Message sent to SQS");
  } catch (error) {
    console.error("Error sending message to SQS:", error.message);
  }
}

module.exports = sendEmailToQueue;
