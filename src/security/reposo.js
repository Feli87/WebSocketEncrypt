const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (hash) => {
  const parts = hash.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString();
};

// Ejemplo de uso
const originalText = 'Hello World!';
const encryptedText = encrypt(originalText);
const decryptedText = decrypt(encryptedText);

console.log('Original:', originalText);
console.log('Encrypted:', encryptedText);
console.log('Decrypted:', decryptedText);
