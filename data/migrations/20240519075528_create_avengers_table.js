exports.up = function (knex) {
  return knex.schema.createTable("avengers", function (table) {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.string("superpower", 255);
    // Add the enemy column here with appropriate data type (likely string)
    table.string("enemy", 255);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("avengers");
};
