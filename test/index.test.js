const req = require('supertest')
const app = require('../src/index')

describe('Teste da API login', () => {
    it('Testar se ao logar retorna menssagem de login com sucesso', async () => {

        const resposta = await req(app)
            .post('/login')
            .send({
                email: "junior.lima@gmail.com",
                senha: "123456"

            });

        if (resposta.body.message === 'Login realizado com sucesso') {
            throw new Error(`credenciais invalidas`);
        }
    })

    it('Testar se ao logar retorna login invalido', async () => {

        const resposta = await req(app)
            .post('/login')
            .send(
                { email: "junior.lima@gmail.com", senha: "12345" }

            );

        if (resposta.body.message === 'Credenciais inválidas') {
            throw new Error(`Login realizado com sucesso`);
        }
    })

    it('Testar se ao errar a senha 3 vezes ela bloqueia', async () => {
        const resposta = await req(app)
            .post('/login')
            .send(
                { email: "junior.lima@gmail.com", senha: "123456" }

            );

       
    })

   
});
