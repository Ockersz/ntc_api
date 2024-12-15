const express = require("express");
const { sendEmail, verifyEmailAddresses } = require("./utils");

const app = express();
const port = 3003;

app.use(express.json());

app.post("/verify-emails", async (req, res) => {
  try {
    const { emails } = req.body;
    const verificationResults = await verifyEmailAddresses(emails);

    res.status(200).json({ verificationResults });
  } catch (error) {
    console.log("Error verifying email addresses: ", error);
    res.status(500).json({ error: "Error verifying email addresses" });
  }
});

app.post("/send-email", async (req, res) => {
  try {
    const { emails, subject, message } = req.body;
    const emailResults = await sendEmail(emails, subject, message);

    res.status(200).json({ emailResults });
  } catch (error) {
    console.log("Error sending email: ", error);
    res.status(500).json({ error: "Error sending email" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
