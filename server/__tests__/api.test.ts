import request from 'supertest';
import { describe, it, expect } from 'vitest';

// Start the built server (dist) is heavy; instead test via dev server entry would require refactor.
// For smoke tests, validate health endpoint contract using a minimal express instance mock if needed.

import express from 'express';
import { healthCheck } from '../health';

describe('API smoke', () => {
  it('GET /api/health returns healthy', async () => {
    const app = express();
    app.get('/api/health', healthCheck as any);
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});