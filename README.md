# Seguridad en Node.js: Pasos y Herramientas

## Generar Llaves de Seguridad

Generar llaves de seguridad es crucial para establecer una comunicación segura entre el servidor y los clientes. Estas llaves se utilizan para encriptar y desencriptar la información que se transmite, asegurando que los datos no puedan ser interceptados o alterados por terceros.

### Generar una clave privada (privkey.pem)
  
```sh
  openssl genpkey -algorithm RSA -out privkey.pem -aes256
```

- Descripción: Este comando genera una clave privada utilizando el algoritmo RSA y la protege con cifrado AES-256.
- Propósito: La clave privada es esencial para la encriptación de datos y la autenticación del servidor. Debe mantenerse secreta y protegida.
  
### Generar un certificado autofirmado (fullchain.pem)

```sh
  openssl req -new -x509 -key privkey.pem -out fullchain.pem -days 365
```

- Descripción: Este comando crea un certificado autofirmado válido por un año.
- Propósito: El certificado permite que los clientes verifiquen la identidad del servidor y establezcan una conexión encriptada.

### Crear una solicitud de certificado (CSR)

```sh
  openssl req -new -key privkey.pem -out cert.csr
```

- Descripción: Este comando genera una solicitud de certificado que puede ser enviada a una autoridad certificadora (CA).
- Propósito: La CSR se utiliza para obtener un certificado firmado por una CA, lo cual es más seguro y confiable que un certificado autofirmado.

### Generar certificado autofirmado

```sh
  openssl x509 -req -days 365 -in cert.csr -signkey privkey.pem -out fullchain.pem
```

- Descripción: Este comando utiliza la CSR y la clave privada para generar un certificado autofirmado válido por un año.
- Propósito: Permite utilizar el certificado para comunicaciones seguras mientras se espera el certificado de una CA o como una solución temporal.

### Puedes usar comandos de openssl para verificar manualmente la configuración SSL/TLS

```sh
  openssl s_client -connect localhost:3000
```

### Usa herramientas como nmap para escanear los puertos y verificar que solo los puertos necesarios están abiertos

```sh
  nmap -sS -p 3000 localhost
```

### Escaneo de Vulnerabilidades: Usa herramientas como Nikto para escanear tu servidor web en busca de vulnerabilidades conocidas

```sh
  nikto -h https://localhost:3000
```

### TLS Scanner: Usa herramientas como testssl.sh para escanear tu servidor y verificar la configuración de TLS

```sh
  testssl.sh https://localhost:3000
```

### Buenas Prácticas

- Actualizar Dependencias: Mantén tus dependencias y librerías actualizadas para evitar vulnerabilidades conocidas.

- Configurar el servidor correctamente: Asegúrate de que tu servidor esté configurado para usar solo protocolos y cifrados seguros. Por ejemplo, deshabilita TLS 1.0 y 1.1, y usa TLS 1.2 o superior.

- Asegurarte de que todas las rutas estén servidas a través de HTTPS: Puedes usar navegadores modernos y verificar que siempre ves el candado de seguridad en la barra de direcciones.

- Verificar los encabezados de seguridad HTTP: Usa herramientas en línea como Security Headers para verificar que estás usando encabezados de seguridad como Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, etc.

### Librerías Comunes para la Seguridad en Node.js

1. **Helmet**
   - **Descripción**: Helmet ayuda a asegurar las aplicaciones Express configurando varios encabezados HTTP.
   - **Propósito**: Configura encabezados de seguridad como `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, y más.

2. **cors**
   - **Descripción**: Habilita CORS (Cross-Origin Resource Sharing) con varias opciones.
   - **Propósito**: Configura políticas CORS para tu servidor.

3. **express-rate-limit**
   - **Descripción**: Middleware para limitar el número de solicitudes a tu API.
   - **Propósito**: Previene ataques de fuerza bruta y denegación de servicio (DoS).

4. **express-session**
   - **Descripción**: Middleware para gestionar sesiones.
   - **Propósito**: Manejo seguro de sesiones de usuario.

5. **csurf**
   - **Descripción**: Middleware para protección contra ataques CSRF (Cross-Site Request Forgery).
   - **Propósito**: Protege tu aplicación de solicitudes maliciosas.

6. **bcrypt**
   - **Descripción**: Biblioteca para cifrar contraseñas.
   - **Propósito**: Hash y verificación de contraseñas de manera segura.

7. **dotenv**
   - **Descripción**: Carga variables de entorno desde un archivo `.env` en `process.env`.
   - **Propósito**: Mantener configuraciones sensibles fuera del código fuente.

8. **jsonwebtoken**
   - **Descripción**: Implementación de JSON Web Tokens (JWT) para autenticación.
   - **Propósito**: Autenticar usuarios y proteger rutas.

9. **express-validator**
   - **Descripción**: Conjunto de middlewares para validar y sanear datos de entrada.
   - **Propósito**: Validación de datos de entrada para evitar ataques de inyección.

10. **hpp**
    - **Descripción**: Previene ataques de contaminación de parámetros HTTP.
    - **Propósito**: Evita la inyección de parámetros duplicados en las solicitudes HTTP.
