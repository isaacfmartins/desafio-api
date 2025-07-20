const request = require('supertest');
const { expect } = require('chai');
const postResetPassword = require('../fixtures/postResetPassword.json');
const postLogin = require('../fixtures/postLogin.json');
require('dotenv').config();
const { obterToken } = require('../helprers/autenticador.js');
const { resetTokens, app } = require('../index.js');

describe('Reset Password API', () => {

    let authToken;
    const baseUrl = process.env.BASE_URL;
    beforeEach(async () => {

        authToken = await obterToken('julio.lima@test.com');

    })
    describe('POST /reset-password', () => {

        it('Deve redefinir senha com token válido', async () => {
            const bodyResetPassword = { ...postResetPassword, token: authToken };
            const response = await request(baseUrl)
                .post('/reset-password')
                .set('Content-Type', 'application/json')
                .send(bodyResetPassword);
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Senha redefinida com sucesso.');

            // Verifica se a senha foi realmente alterada
            const bodyLogin = { ...postLogin, password: bodyResetPassword.newPassword };
            const loginResponse = await request(baseUrl)
            .post('/login') 
            .set('Content-Type', 'application/json')                
            .send(bodyLogin);
            expect(loginResponse.status).to.equal(200);
            expect(loginResponse.body.message).to.equal('Login realizado com sucesso!');
            console.log(bodyLogin);
            console.log(loginResponse.body);
        });

        it('Deve retornar erro ao redefinir senha com token inválido', async () => {
            const bodyResetPassword = { ...postResetPassword, token: 'token-invalido' };
            const response = await request(baseUrl)
                .post('/reset-password')
                .set('Content-Type', 'application/json')
                .send(bodyResetPassword);
            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal('Token inválido ou expirado.');
        });

        it('Deve retornar erro ao redefinir senha com token expirado', async () => {
            const forgotResponse = await request(app)
            .post('/forgot-password')
            .send({ email: 'julio.lima@test.com' });

            const token = forgotResponse.body.token;

            
            resetTokens[token].expiresAt = Date.now() - 1000;


            const bodyResetPassword = { ...postResetPassword, token };
            const response = await request(app)
                .post('/reset-password')
                .set('Content-Type', 'application/json')
                .send(bodyResetPassword);

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal('Token expirado. Solicite um novo.');
        });

        afterEach(async () => {
            // Redefine a senha para o valor original após os testes

            const token = await obterToken('julio.lima@test.com');

            const bodyResetPassword = { ...postResetPassword, token, newPassword: '123456' };
            const response = await request(baseUrl)
                .post('/reset-password')
                .set('Content-Type', 'application/json')
                .send(bodyResetPassword);
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Senha redefinida com sucesso.');

        });
    });
});