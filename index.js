const express = require("express");
const avengersModel = require("./avengers/avengers-model");

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/avengers", async (req, res) => {
  try {
    const avengers = await avengersModel.getAllAvengers();
    res.json(avengers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/avengers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const avenger = await avengersModel.getAvengerById(id);
    if (!avenger) {
      return res.status(404).json({ message: "Avenger not found" });
    }
    res.json(avenger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/avengers", async (req, res) => {
  const avengerData = req.body;
  try {
    const newAvengerId = await avengersModel.createAvenger(avengerData);
    const newAvenger = await avengersModel.getAvengerById(newAvengerId);
    res.status(201).json(newAvenger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/avengers/:id", async (req, res) => {
  const { id } = req.params;
  const avengerData = req.body;
  try {
    const updatedCount = await avengersModel.updateAvenger(id, avengerData);
    if (updatedCount === 0) {
      return res.status(404).json({ message: "Avenger not found" });
    }
    const updatedAvenger = await avengersModel.getAvengerById(id);
    res.json(updatedAvenger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/avengers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await avengersModel.deleteAvenger(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Avenger not found" });
    }
    res.json({ message: "Avenger deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
