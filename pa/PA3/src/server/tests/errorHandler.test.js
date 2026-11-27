import request from 'supertest';
import express from 'express';
import { errorHandler, notFound, AppError } from '../src/middlewares/index.js';
import app from '../app.js';

describe('Error Handling Middleware', () => {
  it('should return 404 with standard format on unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'Cannot GET /api/does-not-exist',
        details: null,
      },
    });
  });

  it('should return 400 for validation errors without leaking stack', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Email/username and password are required',
      details: null,
    });
    expect(res.body.stack).toBeUndefined();
    expect(res.body.error.stack).toBeUndefined();
  });

  it('should handle unhandled 500 errors and never expose stack traces', async () => {
    // Create an isolated test express app with a route that throws an unhandled error
    const testApp = express();
    testApp.get('/test-crash', () => {
      throw new Error('Database disk failed unexpectedly!');
    });
    testApp.use(notFound);
    testApp.use(errorHandler);

    const res = await request(testApp).get('/test-crash');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
    expect(res.body.error).toHaveProperty('message');
    expect(res.body.error.details).toBeNull();
    // Verify stack is never leaked in JSON
    expect(res.body.stack).toBeUndefined();
    expect(res.body.error.stack).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toContain('at Test.');
  });

  it('should support custom AppError with statusCode and details', async () => {
    const testApp = express();
    testApp.get('/test-custom', () => {
      throw new AppError('Policy conflict detected', 409, 'POLICY_CONFLICT', { field: 'copyId' });
    });
    testApp.use(errorHandler);

    const res = await request(testApp).get('/test-custom');

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      error: {
        code: 'POLICY_CONFLICT',
        message: 'Policy conflict detected',
        details: { field: 'copyId' },
      },
    });
  });
});
