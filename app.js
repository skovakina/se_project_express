const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", require("./routes/users"));
app.use("/clothingitems", require("./routes/clothingitems"));

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`app is runnig at port ${PORT}`);
});
