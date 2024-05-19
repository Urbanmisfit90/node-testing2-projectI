const request = require('supertest');
const app = require('./index'); // Assuming your Express application is exported from index.js

// Test GET request to / endpoint
test('GET / should return status 200 and "Hello, world!"', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
  expect(response.text).toBe('Hello, world!');
});

// Test GET request to /users endpoint
test('GET /users should return status 200 and JSON with users data', async () => {
  const response = await request(app).get('/users');
  expect(response.status).toBe(200);
  expect(response.body).toEqual(expect.any(Array));
});

// Test POST request to /users endpoint
test('POST /users should return status 201 and JSON with created user data', async () => {
  const newUser = { username: 'test_user', email: 'test@example.com' };
  const response = await request(app).post('/users').send(newUser);
  expect(response.status).toBe(201);
  expect(response.body).toMatchObject(newUser);
});

// Test GET request to undefined endpoint
test('GET undefined endpoint should return status 404', async () => {
  const response = await request(app).get('/undefined');
  expect(response.status).toBe(404);
});
