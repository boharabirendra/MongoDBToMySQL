const TABLE_NAME = 'rnr_appreciation_total_counts';

const RELATED_TABLES = {
  APPRECIATIONS: 'rnr_appreciations',
  APPRECIATION_TYPES: 'rnr_appreciation_types',
};

/**
 * Create table <table_name>.
 *
 * @param  {object} knex
 * @return {Promise}
 */
function up(knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.string('id', 36).notNullable().primary();
    table.string('appreciation_id', 36).notNullable();
    table.integer('count').notNullable();
    table.integer('appreciation_type_weight').notNullable();
    table.string('appreciation_type_id', 36).notNullable();
    table
      .foreign('appreciation_id')
      .references('id')
      .inTable(RELATED_TABLES.APPRECIATIONS)
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
