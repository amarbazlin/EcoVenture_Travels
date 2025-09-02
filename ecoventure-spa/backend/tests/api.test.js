// tests/api.test.js
const request = require('supertest');
const app = require('../server');

describe('EcoVenture API Endpoints', () => {
  // Health Check
  describe('Health Check', () => {
    test('GET /api/health should return success', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'EcoVenture API is running');
    });
  });

  // Tours
  describe('Tours Endpoints', () => {
    let createdTourId;

    test('GET /api/tours should return tours list', async () => {
      const res = await request(app).get('/api/tours').expect(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('POST /api/tours should create a new tour', async () => {
      const newTour = {
        name: 'Test Adventure',
        country: 'TESTLAND',
        category: 'hiking',
        description: 'API validation test tour',
        days: 5,
        price: 999,
        image: '/test.jpg'
      };

      const res = await request(app)
        .post('/api/tours')
        .send(newTour)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      createdTourId = res.body.data.id;
    });

    test('GET /api/tours/:id should return specific tour', async () => {
      const res = await request(app).get(`/api/tours/${createdTourId}`).expect(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('id', createdTourId);
    });

    test('DELETE /api/tours/:id should delete a tour', async () => {
      await request(app).delete(`/api/tours/${createdTourId}`).expect(200);
      await request(app).get(`/api/tours/${createdTourId}`).expect(404);
    });
  });

  // Categories
  describe('Categories Endpoints', () => {
    test('GET /api/categories should return categories', async () => {
      const res = await request(app).get('/api/categories').expect(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
