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
    expect(response.body.message).toBe('Avenger created successfully');

    // expect(response.body.name).toBe('Spider-Man');
    // expect(response.body.superpower).toBe('Spider-like abilities');
    // expect(response.body.enemy).toBe('Green Goblin');
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
  // Additional Tests
  it('should return 400 for creating an avenger with missing fields', async () => {
    const newAvenger = {
      name: 'Spider-Man'
      // Missing superpower and enemy fields
    };

    const response = await request(server).post('/avengers').send(newAvenger);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing required fields');
  });

  it('should return 404 for getting an avenger that does not exist', async () => {
    const response = await request(server).get('/avengers/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Avenger not found');
  });

  it('should return 404 for updating an avenger that does not exist', async () => {
    const updatedAvenger = {
      name: 'Non-Existent Avenger',
      superpower: 'Unknown',
      enemy: 'Unknown'
    };

    const response = await request(server).put('/avengers/999').send(updatedAvenger);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Avenger not found');
  });

  it('should return 404 for deleting an avenger that does not exist', async () => {
    const response = await request(server).delete('/avengers/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Avenger not found');
  });

  it('should create multiple avengers and verify count', async () => {
    const newAvengers = [
      { name: 'Black Panther', superpower: 'Enhanced strength and agility', enemy: 'Killmonger' },
      { name: 'Doctor Strange', superpower: 'Master of the mystic arts', enemy: 'Dormammu' }
    ];

    await Promise.all(newAvengers.map(avenger => request(server).post('/avengers').send(avenger)));

    const response = await request(server).get('/avengers');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(6); // 6 initial + 2 new avengers
  });

  it('should update an avenger with valid data', async () => {
    const updatedAvengerData = {
      name: 'Ironman Updated',
      superpower: 'Genius-level intellect with Updated Powered Armor',
      enemy: 'Updated The Mandarin'
    };
  
    const response = await request(server)
      .put('/avengers/1')
      .send(updatedAvengerData);
  
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Ironman Updated');
    expect(response.body.superpower).toBe('Genius-level intellect with Updated Powered Armor');
    expect(response.body.enemy).toBe('Updated The Mandarin');
  });
  
  it('should return 400 for updating an avenger with invalid data', async () => {
    const updatedAvengerData = {
      // Missing required 'superpower' field
      name: 'Ironman Updated',
      enemy: 'Updated The Mandarin'
    };
  
    const response = await request(server)
      .put('/avengers/1')
      .send(updatedAvengerData);
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing required fields');
  });
})

