const request = require('supertest');
const { expect } = require('chai');
const postForgotPassword = require('../fixtures/postForgotPassword.json');
require('dotenv').config();

const baseUrl = process.env.BASE_URL;

describe('Forgot Password API', () => {
    describe('POST /forgot-password', () => {

        it('Deve solicitar redefinição de senha com email válido', async () => {
            const bodyForgotPassword = { ...postForgotPassword };
            const response = await request(baseUrl)
                .post('/forgot-password')
                .set('Content-Type', 'application/json')
                .send(bodyForgotPassword);
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Token gerado. Expira em 15 minutos.');
        });

        it('Deve retornar erro ao solicitar redefinição de senha com email inválido', async () => {
            const bodyForgotPassword = { ...postForgotPassword, email: 'teste@test.com' };
            const response = await request(baseUrl)
                .post('/forgot-password')
                .set('Content-Type', 'application/json')
                .send(bodyForgotPassword);
            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('Usuário inválido.');
        });
    });
});