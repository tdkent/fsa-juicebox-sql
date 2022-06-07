const express = require('express');
const server = express();

const { client } = require('./db');

const apiRouter = require('./api');
const PORT = 4000;

server.use((req, res, next) => {
  const morgan = require('morgan');
  server.use(morgan('dev'));
  server.use(express.json());
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");
  next();
})

server.use('/api', apiRouter);

client.connect();

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})