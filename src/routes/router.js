const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello Secure World!');
});

router.post('/user',
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

module.exports = router;
