require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send({
    success: true,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
