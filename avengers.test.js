const request = require('supertest');
const db = require('./data/db-config');
const app = require('./index');

let server;

beforeAll((done) => {
  server = app.listen(9000, done);
});

afterAll((done) => {
  server.close(done);
});

// Ensure the database is properly migrated and seeded before each test
beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
});

// Clean up the database after each test
afterEach(async () => {
  await db.migrate.rollback();
});

// Tests
describe('Avengers API', () => {
  it('should create a new avenger', async () => {
    const newAvenger = {
      name: 'Spider-Man',
      superpower: 'Spider-like abilities',
      enemy: 'Green Goblin'
    };

    const response = await request(server).post('/avengers').send(newAvenger);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Spider-Man');
    expect(response.body.superpower).toBe('Spider-like abilities');
    expect(response.body.enemy).toBe('Green Goblin');
  });

  it('should get all avengers', async () => {
    const response = await request(server).get('/avengers');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get an avenger by ID', async () => {
    const response = await request(server).get('/avengers/1');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Ironman');
  });

  it('should update an avenger', async () => {
    const updatedAvenger = {
      name: 'Ironman Updated',
      superpower: 'Genius-level intellect with Powered Armor Updated',
      enemy: 'The Mandarin Updated'
    };

    const response = await request(server).put('/avengers/1').send(updatedAvenger);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Ironman Updated');
  });

  it('should delete an avenger', async () => {
    const response = await request(server).delete('/avengers/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Avenger deleted successfully');
  });
});
