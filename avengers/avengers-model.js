const db = require("../data/db-config");

function getAllAvengers() {
  return db('avengers').select('id', 'name', 'superpower', 'enemy');
}

function getAvengerById(id) {
  return db("avengers").where({ id }).first();
}

function createAvenger(avengerData) {
  return db("avengers").insert(avengerData).returning('id'); // Ensure returning ID
}

function updateAvenger(id, avengerData) {
  return db("avengers").where({ id }).update(avengerData);
}

function deleteAvenger(id) {
  return db("avengers").where({ id }).del();
}

module.exports = {
  getAllAvengers,
  getAvengerById,
  createAvenger,
  updateAvenger,
  deleteAvenger,
};


