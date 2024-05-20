const request = require('supertest');
const express = require('express');
const db = require('./data/db-config');
const avengersModel = require('./avengers/avengers-model');

const app = express();
app.use(express.json());

app.get('/avengers', async (req, res) => {
  try {
    const avengers = await avengersModel.getAllAvengers();
    res.json(avengers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/avengers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const avenger = await avengersModel.getAvengerById(id);
    if (!avenger) {
      return res.status(404).json({ message: 'Avenger not found' });
    }
    res.json(avenger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/avengers', async (req, res) => {
  const avengerData = req.body;
  try {
    const [id] = await avengersModel.createAvenger(avengerData);
    const newAvenger = await avengersModel.getAvengerById(id);
    res.status(201).json(newAvenger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/avengers/:id', async (req, res) => {
  const { id } = req.params;
  const avengerData = req.body;
  try {
    const updatedCount = await avengersModel.updateAvenger(id, avengerData);
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Avenger not found' });
    }
    const updatedAvenger = await avengersModel.getAvengerById(id);
    res.json(updatedAvenger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/avengers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await avengersModel.deleteAvenger(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Avenger not found' });
    }
    res.json({ message: 'Avenger deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tests
describe('Avengers API', () => {
  beforeEach(async () => {
    // Run the migrations and seed the database
    await db.migrate.rollback();
    await db.migrate.latest();
    await db.seed.run();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await db.migrate.rollback();
  });

  it('should create a new avenger', async () => {
    const newAvenger = {
      name: 'Spider-Man',
      superpower: 'Spider-like abilities',
      enemy: 'Green Goblin'
    };

    const response = await request(app).post('/avengers').send(newAvenger);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Spider-Man');
  });

  it('should get all avengers', async () => {
    const response = await request(app).get('/avengers');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get an avenger by ID', async () => {
    const response = await request(app).get('/avengers/1');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Ironman');
  });

  it('should update an avenger', async () => {
    const updatedAvenger = {
      name: 'Ironman Updated',
      superpower: 'Genius-level intellect with Powered Armor Updated',
      enemy: 'The Mandarin Updated'
    };

    const response = await request(app).put('/avengers/1').send(updatedAvenger);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Ironman Updated');
  });

  it('should delete an avenger', async () => {
    const response = await request(app).delete('/avengers/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Avenger deleted successfully');
  });
});

module.exports = app; // For testin