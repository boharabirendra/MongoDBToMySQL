const TABLE_NAME = 'rnr_emojis';

/**
 * Create table <table_name>.
 *
 * @param  {object} knex
 * @return {Promise}
 */
function up(knex) {
  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('id', 36).primary();
    table.string('emoji_id', 255).notNullable().unique();
    table.string('created_by_name', 255).notNullable();
    table.integer('created_by_id').notNullable();
    table.integer('created_by_emp_id');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

/**
 * Drop table <table_name>.
 *
 * @param  {object} knex
 * @return {Promise}
 */
function down(knex) {
  return knex.schema.dropTable(TABLE_NAME);
}

module.exports = {
  up,
  down,
};
