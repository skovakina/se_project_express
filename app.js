const express = require("express");
const app = express();

const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.listen(PORT, () => {
  console.log(`app is runnig at port ${PORT}`);
});
