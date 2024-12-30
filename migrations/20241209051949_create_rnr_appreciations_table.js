const TABLE_NAME = 'rnr_appreciations';

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
    table.string('appraisee_name', 255).notNullable();
    table.integer('appraisee_id').notNullable();
    table.integer('appraisee_emp_id');
    table.string('appraisee_department', 255).notNullable();
    table.string('appraisee_designation', 255).notNullable();
    table.string('campaign_id', 36);
    table.integer('total_weight_vote').defaultTo(0);
    table.integer('nominated_by');
    table.timestamp('nominated_date');
    table.boolean('nominated_status').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
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
