const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const { NOT_FOUND } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", require("./routes/users"));
app.use("/", require("./routes/clothingitems"));

app.use((req, res) => {
  res.status(NOT_FOUND).send("Sorry can't find that!");
});

app.listen(PORT, () => {
  console.log(`app is runnig at port ${PORT}`); // eslint-disable-line
});
