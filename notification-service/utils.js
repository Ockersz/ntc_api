const AWS = require("aws-sdk");
require("dotenv").config();

// Configure AWS SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

const ses = new AWS.SES();

/**
 * Verify a list of email addresses.
 * @param {string[]} emails - List of email addresses to verify.
 * @returns {Promise<object>} Results of email verification.
 */
const verifyEmailAddresses = async (emails) => {
  if (!Array.isArray(emails) || emails.length === 0) {
    console.error("Email list is invalid or empty.");
    return { success: [], failed: ["No emails provided"] };
  }

  const verificationResults = await Promise.allSettled(
    emails.map(async (email) => {
      const params = { EmailAddress: email };

      try {
        await ses.verifyEmailIdentity(params).promise();
        console.log(`Verification initiated for: ${email}`);
        return { email, status: "success" };
      } catch (error) {
        console.error(`Error verifying email: ${email}`, error.message);
        return { email, status: "failed", error: error.message };
      }
    })
  );

  return parseResults(verificationResults);
};

/**
 * Send an email to a list of recipients.
 * @param {string|string[]} emails - List of recipient email addresses or a single email address.
 * @param {string} subject - Email subject.
 * @param {string} message - Email message body.
 * @returns {Promise<object>} Results of email sending.
 */
const sendEmail = async (emails, subject, message) => {
  if (!emails || (Array.isArray(emails) && emails.length === 0)) {
    console.error("Email list is invalid or empty.");
    return { success: [], failed: ["No emails provided"] };
  }

  // Ensure emails is an array
  if (!Array.isArray(emails)) {
    emails = [emails];
  }

  const emailResults = await Promise.allSettled(
    emails.map(async (email) => {
      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: message,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
        Source: process.env.SES_SOURCE_EMAIL || "shaheinockersz1234@gmail.com", // Use environment variable for the source email
      };

      try {
        await ses.sendEmail(params).promise();
        console.log(`Email sent successfully to: ${email}`);
        return { email, status: "success" };
      } catch (error) {
        console.error(`Error sending email to: ${email}`, error.message);
        return { email, status: "failed", error: error.message };
      }
    })
  );

  return parseResults(emailResults);
};

/**
 * Helper function to parse results from Promise.allSettled.
 * @param {Array} results - Array of Promise.allSettled results.
 * @returns {object} Parsed success and failure results.
 */
const parseResults = (results) => {
  const success = [];
  const failed = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      success.push(result.value);
    } else {
      failed.push({
        error: result.reason?.message || "Unknown error",
        ...result.reason,
      });
    }
  });

  return { success, failed };
};

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "info@ockersz.me", // your Namecheap email address
    pass: "9b6pfuqHbYyb9_p", // your email password
  },
});

const sendEmailNew = async (to, subject, html) => {
  try {
    let info = await transporter.sendMail({
      from: '"Ockersz" <info@ockersz.me>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    });
    console.log("Message sent: %s", info.messageId);
    return { status: "success" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { status: "failed", error: error.message };
  }
};

module.exports = {
  verifyEmailAddresses,
  sendEmail,
};
