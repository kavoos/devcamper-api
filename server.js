const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const colors = require('colors');

const errorHandler = require('./middlewares/error');
const connectDB = require('./config/db');

// load env variables
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// initialize the application
const app = express();

// body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(fileupload());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// errorHandler has to be after mount routers
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// call the server
const server = app.listen(
  PORT,
  console.info(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
  )
);

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // close server and exit process
  server.close(() => process.exit(1));
});
