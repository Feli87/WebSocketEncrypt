const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const csurf = require('csurf');
const hpp = require('hpp');
require('dotenv').config();

const app = express();
const routes = require('../routes/router');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'trusted-scripts.com'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN_URL,
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true, sameSite: 'none' }
}));

app.use(csurf({ 
  cookie: true,
  cookieName: 'XSRF-TOKEN',
  cookieHttpOnly: true,
  setHeader: true,
  sameSite: 'none'
}));

app.use(hpp({
  cookie: true,
  parameterLimit: 100,
  maxParameterLimit: 1000
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
