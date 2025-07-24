const request = require('supertest');
const { expect } = require('chai');
const postLogin = require('../fixtures/postLogin.json');
require('dotenv').config();

const baseUrl = process.env.BASE_URL;

describe('Login API', () => {
    describe('POST /login', () => {

        it('Deve bloquear login com credenciais inválidas', async () => {
            const bodyLogin = {...postLogin };
            bodyLogin.password = '765843';
            const response = await request(baseUrl)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);
            expect(response.status).to.equal(401);
            expect(response.body.error).to.equal('Credenciais inválidas.');
        });

        it('Deve realizar login com sucesso', async () => {
            const bodyLogin = {...postLogin};
            const response = await request(baseUrl)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Login realizado com sucesso!');
        });        

        it('Deve bloquear login por 1 minuto por tentativas inválidas', async () => {
            const bodyLogin = { ...postLogin };
            bodyLogin.email = 'teste@test.com';
            let response;
            for (let i = 0; i < 3; i++) {
                response = await request(baseUrl)
                    .post('/login')
                    .set('Content-Type', 'application/json')
                    .send(bodyLogin);
                expect(response.status).to.equal(401);
                expect(response.body.error).to.equal('Credenciais inválidas.');
                console.log(`Tentativa ${i} falhou:`, response.body.error);
            }
            const responseTerceiraTentiva = await request(baseUrl)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);
            expect(responseTerceiraTentiva.status).to.equal(423);
            expect(responseTerceiraTentiva.body.error).to.equal('Usuário bloqueado por 1 minuto após 3 tentativas inválidas.');
            console.log(`Tentativa 3 falhou:`, responseTerceiraTentiva.body);

            const responseQuartaTentiva = await request(baseUrl)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);
            expect(responseQuartaTentiva.status).to.equal(423);
            expect(responseQuartaTentiva.body.error).to.equal('Usuário bloqueado. Tente novamente em 1 minuto.');
            console.log(`Tentativa 4 falhou:`, responseQuartaTentiva.body);
        });
    })

});