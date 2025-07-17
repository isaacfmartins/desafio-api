# API de Login (Mentoria 2.0)

Esta é uma API RESTful para estudo de testes de software, implementada em Node.js com Express. Não utiliza banco de dados, todos os dados são mantidos em memória.

## Objetivo
- Realizar login com bloqueio após 3 tentativas inválidas (bloqueio de 1 minuto)
- Esqueci a senha: geração de token de redefinição com expiração de 15 minutos
- Redefinição de senha via token
- Documentação interativa via Swagger

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie a API:
   ```bash
   node index.js
   ```
3. Acesse a documentação Swagger:
   - [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Endpoints

### POST /login
- **Body:** `{ "email": "julio.lima@test.com", "password": "123456" }`
- **Respostas:**
  - 200: Login realizado com sucesso
  - 401: Credenciais inválidas
  - 423: Usuário bloqueado temporariamente

### POST /forgot-password
- **Body:** `{ "email": "julio.lima@test.com" }`
- **Respostas:**
  - 200: Token de redefinição enviado (com expiração de 15 minutos)
  - 404: Usuário inválido

### POST /reset-password
- **Body:** `{ "token": "<token>", "newPassword": "<novaSenha>" }`
- **Respostas:**
  - 200: Senha redefinida com sucesso
  - 400: Token inválido ou expirado

## Observações
- Todos os dados são armazenados em memória.
- API para fins de estudo, não utilizar em produção. 