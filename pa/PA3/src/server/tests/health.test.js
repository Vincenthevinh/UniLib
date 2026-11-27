import request from 'supertest';
import app from '../app.js';

describe('GET /api/health', () => {
  it('should return 200 with { status: "ok", db: "up|down" }', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(['up', 'down']).toContain(res.body.db);
    expect(res.headers['x-request-id']).toBeDefined();
  });
});
