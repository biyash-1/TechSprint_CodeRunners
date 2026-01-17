const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRouter = require("./routes/authRoutes");
const accidentRouter = require("./routes/accidentRouter")
require("dotenv").config();

const dbconenction = require("./config/dbConfig");
const DataBaseConnection = require("./config/dbConfig");

const app = express();
const port = process.env.PORT;

DataBaseConnection();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/accident",accidentRouter)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
