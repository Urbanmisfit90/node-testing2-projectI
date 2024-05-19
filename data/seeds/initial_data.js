// initial_data.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("avengers").del(); // Inserts seed entries
  await knex("avengers").insert([
    {
      id: 1,
      name: "Ironman",
      superpower: "Genius-level intellect with Powered Armor",
      enemy: "The Mandarin",
    },
    {
      id: 2,
      name: "Captain America",
      superpower: "Peak Human Abilities from Super-Soldier Serum",
      enemy: "Baron Zemo",
    },
    {
      id: 3,
      name: "Thor",
      superpower: "God like abilities granted by Mjolnir",
      enemy: "Loki Laufeyson",
    },
    {
      id: 4,
      name: "Hulk",
      superpower: "Superhuman strength and durability from Gamma radiation",
      enemy: "The Abomination",
    },
    {
      id: 5,
      name: "Black Widow",
      superpower: "Master Spy with Peak Human Abilities",
      enemy: "Madame Hydra",
    },
    {
      id: 6,
      name: "Hawkeye",
      superpower: "Superhuman Accuracy with projectiles",
      enemy: "Crossfire",
    },
  ]);
};
