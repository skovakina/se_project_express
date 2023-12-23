const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "6585dbe5db2c62b047224c03",
  };
  next();
});

app.use("/", require("./routes/users"));
app.use("/", require("./routes/clothingitems"));

app.listen(PORT, () => {
  console.log(`app is runnig at port ${PORT}`);
});
