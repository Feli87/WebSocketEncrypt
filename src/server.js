const https = require('https');
const app = require('./app/app');
const options = require('./config/httpsOptions');
const port = process.env.PORT || 3000;

const server = https.createServer(options, app);
const io = require('socket.io')(server);

require('./socket/socket')(io);

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
