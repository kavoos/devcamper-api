const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// route files
const bootcamps = require('./routes/bootcamps');

// load env variables
dotenv.config({ path: './config/config.env' });

// initialize the application
const app = express();

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

// call the server
app.listen(
  PORT,
  console.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
