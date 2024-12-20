const AWS = require("aws-sdk");
const { sendEmail, sendEmailNew } = require("./utils");
require("dotenv").config();
// Configure the AWS SDK

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Or your hardcoded key
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Or your hardcoded secret
  region: process.env.AWS_REGION,
});

const sqs = new AWS.SQS();

async function pollMessagesFromSQS() {
  const params = {
    QueueUrl: process.env.QUEUE_URL,
    WaitTimeSeconds: 10,
  };
  try {
    const data = await sqs.receiveMessage(params).promise();
    if (data.Messages && data.Messages.length > 0) {
      for (const message of data.Messages) {
        // Process the message

        const email = JSON.parse(message.Body);
        const results = await sendEmailNew(
          email.recipient,
          email.subject,
          email.body
        );
        // Delete the message after processing

        if (results && results.status === "success") {
          await sqs
            .deleteMessage({
              QueueUrl: process.env.QUEUE_URL,
              ReceiptHandle: message.ReceiptHandle,
            })
            .promise();
        } else {
          await sendEmailNew(
            "shaheinockersz1234@gmail.com",
            "Email not sent to " + email.recipient,
            "The email was not sent to " +
              email.recipient +
              " because of the following error: " +
              results.error
          );

          // Delete the message after processing
          await sqs
            .deleteMessage({
              QueueUrl: process.env.QUEUE_URL,
              ReceiptHandle: message.ReceiptHandle,
            })
            .promise();
        }
      }
    }
  } catch (error) {
    console.error("Error receiving messages from SQS:", error.message);
  }

  // Continue polling
  pollMessagesFromSQS();
}

// Start polling
pollMessagesFromSQS();

module.exports = { pollMessagesFromSQS };
