const TABLE_NAME = 'rnr_campaign_emojis';

const RELATED_TABLES = {
  CAMPAIGNS: 'rnr_campaigns',
};

/**
 * Create table <table_name>.
 *
 * @param  {object} knex
 * @return {Promise}
 */
function up(knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.string('id', 36).primary();
    table.string('emoji_id', 255).notNullable();
    table.string('campaign_id', 36).notNullable();
    table.integer('appreciator_id').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table
      .foreign('campaign_id')
      .references('id')
      .inTable(RELATED_TABLES.CAMPAIGNS)
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
