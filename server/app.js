const express = require("express");
const app = express();
module.exports = app;

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
