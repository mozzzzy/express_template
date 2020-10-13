const request = require('supertest');
const app = require('../../src/middlewares/sleep');

describe('Test of sleep module', () => {
  test('Return 200 OK', () => request(app).get('/sleep?ms=1000').then((res) => {
    expect(res.statusCode).toBe(200);
  }));

  test('Return 400 Bad Request when request without ms query', () => request(app).get('/sleep').then((res) => {
    expect(res.statusCode).toBe(400);
  }));

  test('Return 400 Bad Request when request with ms=string query', () => request(app).get('/sleep?ms=string').then((res) => {
    expect(res.statusCode).toBe(400);
  }));

  test('Return 400 Bad Request when request with too big ms query', () => request(app).get('/sleep?ms=100000000000000000').then((res) => {
    expect(res.statusCode).toBe(400);
  }));
});
