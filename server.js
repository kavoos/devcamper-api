const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
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
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// initialize the application
const app = express();

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// file uploading
app.use(fileupload());

// sanitize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// prevent XSS attacks
app.use(xss());

// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// protect against HTTP parameter pollution attacks
app.use(hpp());

// enable cross-origin resource sharing
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

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
