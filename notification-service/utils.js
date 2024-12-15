const AWS = require("aws-sdk");
require("dotenv").config();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

const ses = new AWS.SES();

const verifyEmailAddresses = async (emails) => {
  try {
    const verificationPromises = emails.map(async (email) => {
      const params = {
        EmailAddress: email,
      };

      return await ses.verifyEmailIdentity(params).promise();
    });
  } catch (error) {
    console.log("Error verifying email addresses: ", error);
    return false;
  }
};

const sendEmail = async (emails, subject, message) => {
  try {
    const emailPromises = emails.map(async (email) => {
      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: message,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
        Source: "shaheinockersz1234@gmail.com",
      };

      return await ses.sendEmail(params).promise();
    });
  } catch (error) {
    console.log("Error sending email: ", error);
    return false;
  }
};

module.exports = {
  verifyEmailAddresses,
  sendEmail,
};
