/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const config = require('./config');
// Routes
const authRouter = require('./routes/Auth');
const userRouter = require('./routes/User');

//Express Instance
const app = express();

// Project Name
console.log(`\n \u001b[1m\u001b[34myour-app Server\u001b[0m 🧰`);

// Dev Middleware
const mode = process.env.NODE_ENV;
console.log(`\n Currently in \u001b[1m\u001b[33m${mode}\u001b[0m mode`);
if (mode === 'development') {
  app.use(morgan('dev'));
}

// Other Middleware
app.use(express.json());

// CORS
const corsOptions = {
  origin: config.cors,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());

//REST Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

module.exports = app;
