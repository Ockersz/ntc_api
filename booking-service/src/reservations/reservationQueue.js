const AWS = require("aws-sdk");
require("dotenv").config();
// Configure the AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sqs = new AWS.SQS();

async function sendMessageToSQS(messageBody) {
  const params = {
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: JSON.stringify(messageBody),
    DelaySeconds: 300, // Optional delay for the message
  };

  try {
    await sqs.sendMessage(params).promise();
  } catch (error) {
    console.error("Error sending message to SQS:", error.message);
  }
}

async function pollMessagesFromSQS() {
  const ReservationService = require("./reservation.service");
  const params = {
    QueueUrl: process.env.QUEUE_URL,
    WaitTimeSeconds: 20, // Long polling for up to 20 seconds
  };

  try {
    const data = await sqs.receiveMessage(params).promise();
    if (data.Messages && data.Messages.length > 0) {
      for (const message of data.Messages) {
        // Process the message
        const reservation = JSON.parse(message.Body);
        await ReservationService.validateReservation(reservation);

        // Delete the message after processing
        await sqs
          .deleteMessage({
            QueueUrl: process.env.QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          })
          .promise();
      }
    }
  } catch (error) {
    console.error("Error receiving messages from SQS:", error.message);
  } finally {
    // Continue polling
    pollMessagesFromSQS();
  }
}

// Start polling
console.log("Started polling messages from SQS");
pollMessagesFromSQS();

module.exports = { sendMessageToSQS, pollMessagesFromSQS };
