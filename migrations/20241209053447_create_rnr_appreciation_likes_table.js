const TABLE_NAME = 'rnr_appreciation_likes';
const RELATED_TABLES = {
  CAMPAIGNS: 'rnr_campaigns',
  APPRECIATIONS: 'rnr_appreciations',
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
    table.integer('appreciator_id').notNullable();
    table.string('campaign_id', 36);
    table.string('appreciation_id', 36);

    table
      .foreign('campaign_id')
      .references('id')
      .inTable(RELATED_TABLES.CAMPAIGNS)
      .onDelete('CASCADE');
    table
      .foreign('appreciation_id')
      .references('id')
      .inTable(RELATED_TABLES.APPRECIATIONS)
      .onDelete('CASCADE');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
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
