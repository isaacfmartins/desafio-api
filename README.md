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

## 🚀 Tecnologias e Bibliotecas Utilizadas

- [Node.js](https://nodejs.org/)
- [Mocha](https://mochajs.org/) – Framework de testes
- [Chai](https://www.chaijs.com/) – Biblioteca de asserções
- [Supertest](https://github.com/visionmedia/supertest) – Testes de integração para HTTP
- [Mochawesome](https://www.npmjs.com/package/mochawesome) – Gerador de relatórios HTML
- [Dotenv](https://github.com/motdotla/dotenv) – Carregamento de variáveis de ambiente

## 📁 Estrutura de Diretórios

```bash
desafio-api/
├── fixtures/                  # Payloads dos endpoints
│   ├── postForgotPassword.json
│   ├── postLogin.json
│   └── postResetPassword.json
├── helpers/                  # Metódos para otimizar a utilização dos endpoints
│   ├── autenticador.js
├── test/                  # Testes organizados por rota
│   ├── forgotPassword.test.js
│   ├── login.test.js
│   └── resetPassword.test.js
│
├── mochawesome-report/   # Relatórios gerados em HTML
│
├── .env                  # Arquivo de variáveis de ambiente (não versionado)
├── package.json          # Gerenciamento de dependências
└── README.md             # Documentação do projeto
```

## ⚙️ Arquivo .env

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
BASE_URL=http://localhost:3000
```

> 🔁 Substitua a URL conforme o ambiente em que a API estiver rodando.

## 📦 Instalação e Execução dos Testes

1. **Clone o repositório:**

```bash
git clone https://github.com/isaacfmartins/desafio-api.git
cd desafio-api
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure o arquivo `.env`** (conforme seção anterior)

4. **Execute os testes:**

```bash
npm test
```

5. **Gerar relatório com Mochawesome:**

```bash
npx mocha test/*.test.js --timeout 200000  --reporter mochawesome
```

> O relatório será gerado no diretório `mochawesome-report/`.

## 📚 Documentação das Bibliotecas

- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/api/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Mochawesome](https://www.npmjs.com/package/mochawesome)
- [Dotenv](https://github.com/motdotla/dotenv)

## 👨‍💻 Contribuição

Sinta-se à vontade para abrir *issues* ou *pull requests* com melhorias ou correções. Este projeto é mantido para fins de estudo e boas práticas em automação de testes.

---
