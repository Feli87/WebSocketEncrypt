require('dotenv').config();
const https = require('https');
const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const csurf = require('csurf');
const hpp = require('hpp');
const port = process.env.PORT || 3000;
const app = express();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

//Secure server
app.use(helmet());

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
  cookie: { secure: true } // set secure to true if using https
}));

app.use(csurf({ cookie: true }));

app.use(hpp());

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../privkey.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../fullchain.pem')),
  passphrase: process.env.PASSPHRASE
};

const server = https.createServer(options, app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.send('Hello Secure World!');
});

app.post('/user', 
  body('email')
    .isEmail().withMessage('Debe ser un correo electrónico válido.')
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false })
    .isLength({ min: 6, max: 100 }).withMessage('El correo electrónico debe tener entre 6 y 100 caracteres.'),
    body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número.')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula.')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe contener al menos un carácter especial.'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Proceed with valid data
    return res.json({
      message: 'Valid data received',
    });
  }
);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


//jwt example
const token = jwt.sign({ userId: 123 }, 'your-256-bit-secret', { expiresIn: '1h' });

jwt.verify(token, 'your-256-bit-secret', function(err, decoded) {
  // decoded contains the decoded payload
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
