const express = require('express');
const dotenv = require('dotenv');

// load env variables
dotenv.config({ path: './config/config.env' });

// initialize the application
const app = express();

const PORT = process.env.PORT || 5000;

// call the server
app.listen(
  PORT,
  console.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
