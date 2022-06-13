require("dotenv").config();
const express = require("express");
const server = express();
const morgan = require("morgan");

const { client } = require("./db");
const apiRouter = require("./api");

const { PORT = 3000 } = process.env;

server.use(morgan("dev"));
server.use(express.json());

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");
  next();
});

server.use("/api", apiRouter);

client.connect();

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
