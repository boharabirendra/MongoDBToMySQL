const TABLE_NAME = 'rnr_appreciation_details';
const RELATED_TABLES = {
  APPRECIATIONS: 'rnr_appreciations',
  CATEGORIES: 'rnr_categories',
  APPRECIATION_TYPES: 'rnr_appreciation_types',
};

/**
 * Create table <table_name>.
 *
 * @param  {object} knex
 * @return {Promise}
 */
function up(knex) {
  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('id', 36).primary();
    table.string('appreciation_id', 36).notNullable();
    table.text('comment').notNullable();
    table.integer('detail_id').notNullable();
    table.string('name', 255).notNullable();
    table.integer('emp_id');
    table.string('department', 255).notNullable();
    table.string('designation', 255).notNullable();
    table.string('category_id', 36);
    table.string('appreciation_type_id', 36);

    table
      .foreign('appreciation_id')
      .references('id')
      .inTable(RELATED_TABLES.APPRECIATIONS)
      .onDelete('CASCADE');
    table
      .foreign('category_id')
      .references('id')
      .inTable(RELATED_TABLES.CATEGORIES)
      .onDelete('CASCADE');
    table
      .foreign('appreciation_type_id')
      .references('id')
      .inTable(RELATED_TABLES.APPRECIATION_TYPES)
      .onDelete('CASCADE');
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
