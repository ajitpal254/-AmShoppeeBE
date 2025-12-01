const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Auth API & Security', () => {
    
    // Close DB connection after tests
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('GET / should return welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Welcome to Node Server');
    });

    it('Rate Limiter should block excessive login attempts', async () => {
        // The limit is 20 requests per 15 minutes
        // We will send 21 requests to trigger the limit
        
        const loginAttempts = [];
        for (let i = 0; i < 22; i++) {
            loginAttempts.push(
                request(app)
                    .post('/app/login')
                    .send({ email: 'test@example.com', password: 'wrongpassword' })
            );
        }

        const responses = await Promise.all(loginAttempts);
        
        // The last response should be 429 Too Many Requests
        const lastResponse = responses[responses.length - 1];
        
        // Note: Depending on race conditions, one of the later ones will fail.
        // We check if ANY response is 429
        const hasRateLimitError = responses.some(res => res.statusCode === 429);
        
        expect(hasRateLimitError).toBe(true);
    }, 30000); // Increase timeout for this test
});
