const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

// Dados em memória
const USER = {
  email: 'julio.lima@test.com',
  password: '123456',
};
let loginAttempts = 0;
let blockedUntil = null;
let resetTokens = {};

// Swagger config
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Login',
      version: '1.0.0',
      description: 'API de Login para estudo de testes de software',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./index.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       423:
 *         description: Usuário bloqueado temporariamente
 */
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const now = Date.now();
  if (blockedUntil && now < blockedUntil) {
    return res.status(423).json({
      error: 'Usuário bloqueado. Tente novamente em 1 minuto.',
    });
  }
  if (email === USER.email && password === USER.password) {
    loginAttempts = 0;
    return res.json({ message: 'Login realizado com sucesso!' });
  } else {
    loginAttempts++;
    if (loginAttempts > 3) {
      blockedUntil = now + 60 * 1000;
      loginAttempts = 0;
      return res.status(423).json({
        error: 'Usuário bloqueado por 1 minuto após 3 tentativas inválidas.',
      });
    }
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }
});

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Solicita redefinição de senha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token de redefinição enviado
 *       404:
 *         description: Usuário inválido
 */
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (email !== USER.email) {
    return res.status(404).json({ error: 'Usuário inválido.' });
  }
  const token = Math.random().toString(36).substring(2, 10);
  const expiresAt = Date.now() + 15 * 60 * 1000;
  resetTokens[token] = { email, expiresAt };
  return res.json({
    token,
    expiresAt: 15,
    message: 'Token gerado. Expira em 15 minutos.',
  });
});

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Redefine a senha usando token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  const data = resetTokens[token];
  if (!data) {
    return res.status(400).json({ error: 'Token inválido ou expirado.' });
  }
  if (Date.now() > data.expiresAt) {
    delete resetTokens[token];
    return res.status(400).json({ error: 'Token expirado. Solicite um novo.' });
  }
  if (data.email !== USER.email) {
    return res.status(400).json({ error: 'Token inválido.' });
  }
  USER.password = newPassword;
  delete resetTokens[token];
  blockedUntil = null;
  loginAttempts = 0;
  return res.json({ message: 'Senha redefinida com sucesso.' });
});

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
  console.log('Swagger em http://localhost:3000/api-docs');
}); 
module.exports = { app, resetTokens };