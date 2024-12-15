const express = require("express");
const { pollMessagesFromSQS } = require("./emailQueue");

const app = express();
const port = 3003;

app.use(express.json());
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
