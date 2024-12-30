const TABLE_NAME = 'rnr_campaign_categories';

const RELATED_TABLES = {
  CAMPAIGNS: 'rnr_campaigns',
  CATEGORIES: 'rnr_categories',
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
    table.string('campaign_id', 36).notNullable();
    table.string('category_id', 36).notNullable();
    table
      .foreign('campaign_id')
      .references('id')
      .inTable(RELATED_TABLES.CAMPAIGNS)
      .onDelete('CASCADE');
    table
      .foreign('category_id')
      .references('id')
      .inTable(RELATED_TABLES.CATEGORIES)
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
