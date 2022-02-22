import request from 'supertest';
import app from '../../src/middlewares/sleep';

describe('Test of sleep module', () => {
  test('Return 200 OK when request with valid ms query', async () => {
    const beforeRequest = new Date();
    const res = await request(app).get('/sleep?ms=1000');
    const afterRequest = new Date();

    expect(afterRequest.getTime() - beforeRequest.getTime()).toBeGreaterThan(1000);
    expect(res.statusCode).toBe(200);
  });

  test('Return 400 Bad Request when request without ms query', async () => {
    const res = await request(app).get('/sleep');
    expect(res.statusCode).toBe(400);
  });

  test('Return 400 Bad Request when request with ms=string query', async () => {
    const res = await request(app).get('/sleep?ms=string');
    expect(res.statusCode).toBe(400);
  });

  test('Return 400 Bad Request when request with too big ms query', async () => {
    const res = await request(app).get('/sleep?ms=100000000000000000');
    expect(res.statusCode).toBe(400);
  });
});
