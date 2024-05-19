const express = require("express");
const db = require("./data/db-config");

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to handle GET requests
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Endpoint to get all avengers
app.get("/avengers", async (req, res, next) => {
  try {
    const avengers = await db("avengers").select("*");
    res.json(avengers);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Endpoint to get a specific avenger by ID
app.get("/avengers/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const avenger = await db("avengers").where({ id }).first();
    if (!avenger) {
      return res.status(404).json({ message: "Avenger not found" });
    }
    res.json(avenger);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Endpoint to create a new avenger
app.post("/avengers", async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  try {
    const [id] = await db("avengers").insert({ name });
    const newAvenger = await db("avengers").where({ id }).first();
    res.status(201).json(newAvenger);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Endpoint to update an existing avenger
app.put("/avengers/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  try {
    const count = await db("avengers").where({ id }).update({ name });
    if (count === 0) {
      return res.status(404).json({ message: "Avenger not found" });
    }
    const updatedAvenger = await db("avengers").where({ id }).first();
    res.json(updatedAvenger);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Endpoint to delete an existing avenger
app.delete("/avengers/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const count = await db("avengers").where({ id }).del();
    if (count === 0) {
      return res.status(404).json({ message: "Avenger not found" });
    }
    res.json({ message: "Avenger deleted successfully" });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes // Send a generic error response

  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
