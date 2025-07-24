const request = require("supertest");
const postForgotPassword = require('../fixtures/postForgotPassword.json');

const obterToken = async (usuario) => {
    const bodyForgotPassword = { ...postForgotPassword };
    const baseUrl = process.env.BASE_URL;
    const res = await request(baseUrl)
        .post(`/forgot-password`)
        .set('Content-Type', 'application/json')
        .send(bodyForgotPassword)
    return res.body.token;
}

module.exports = { obterToken };