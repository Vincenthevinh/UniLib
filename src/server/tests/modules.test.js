import request from 'supertest';
import app from '../app.js';

describe('UniLib API Modules Skeletons', () => {
  it('GET /api/v1/auth/me returns current user profile', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('role', 'ADMINISTRATOR');
  });

  it('GET /api/v1/users returns paginated user list', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.pagination).toBeDefined();
  });

  it('GET /api/v1/books returns catalog search list', async () => {
    const res = await request(app).get('/api/v1/books?q=Clean');
    expect(res.status).toBe(200);
    expect(res.body.data.items[0]).toHaveProperty('isbn');
    expect(res.body.data.items[0]).toHaveProperty('totalCopies');
  });

  it('GET /api/v1/copies returns copies inventory', async () => {
    const res = await request(app).get('/api/v1/copies');
    expect(res.status).toBe(200);
    expect(res.body.data.items[0]).toHaveProperty('barcode');
    expect(res.body.data.items[0]).toHaveProperty('shelfLocation');
  });

  it('GET /api/v1/loans/overdue returns overdue loan list', async () => {
    const res = await request(app).get('/api/v1/loans/overdue');
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.items[0]).toHaveProperty('daysOverdue');
  });

  it('GET /api/v1/reservations returns hold queue', async () => {
    const res = await request(app).get('/api/v1/reservations');
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.items[0]).toHaveProperty('queuePosition');
  });

  it('GET /api/v1/dashboard/reader returns reader loan and reservation overview', async () => {
    const res = await request(app).get('/api/v1/dashboard/reader');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('activeLoans');
    expect(res.body.data).toHaveProperty('activeReservations');
  });
});
