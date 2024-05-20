exports.up = function (knex) {
  return knex.schema.createTable("avengers", function (table) {
    table.increments("id").primary(); // Auto-incrementing primary key
    table.string("name", 255).notNullable(); // Name column, required
    table.string("superpower", 255); // Superpower column
    table.string("enemy", 255); // Enemy column
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("avengers");
};
