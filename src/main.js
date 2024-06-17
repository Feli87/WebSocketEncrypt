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
  cookie: { secure: true, httpOnly: true, sameSite: 'strict' }
}));

app.use(csurf({ 
  cookie: true,
  cookieName: 'XSRF-TOKEN',
  cookieHttpOnly: true,
  setHeader: true,
  sameSite: 'strict'
}));

app.use(hpp({
  cookie: true,
  parameterLimit: 100,
  maxParameterLimit: 1000
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    .isLength({ min: 6, max: 100 }).withMessage('El correo electrónico debe tener entre 6 y 100 caracteres.')
    .escape().withMessage('El correo electrónico contiene caracteres no válidos.'),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número.')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula.')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe contener al menos un carácter especial.')
    .escape().withMessage('La contraseña contiene caracteres no válidos.'),
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

//errors handles
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});

//example front
// Asume que estás usando fetch para hacer la petición
// const email = "test@example.com";
// const password = "YourSecurePassword1!";

// // Obtén el token CSRF desde una cookie
// const csrfToken = document.cookie
//   .split('; ')
//   .find(row => row.startsWith('XSRF-TOKEN'))
//   .split('=')[1];

// fetch('https://tu-servidor.com/user', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'CSRF-Token': csrfToken // Incluye el token CSRF en el encabezado
//   },
//   body: JSON.stringify({ email, password })
// })
// .then(response => response.json())
// .then(data => {
//   if (data.errors) {
//     // Maneja errores de validación
//     console.error(data.errors);
//   } else {
//     console.log('Success:', data);
//   }
// })
// .catch((error) => {
//   console.error('Error:', error);
// });

//jwt example
// const token = jwt.sign({ userId: 123 }, 'your-256-bit-secret', { expiresIn: '1h' });

// jwt.verify(token, 'your-256-bit-secret', function(err, decoded) {
//   // decoded contains the decoded payload
// });