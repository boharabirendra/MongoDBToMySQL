const TABLE_NAME = "rnr_campaign_evaluators";

const RELATED_TABLES = {
  CAMPAIGNS: "rnr_campaigns",
};

/**
 * Create table <table_name>.
 *
 * @param  {object} knex
 * @return {Promise}
 */
function up(knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.string("id", 36).notNullable().primary();
    table.string("campaign_id", 36).notNullable();
    table.integer("evaluator_id").notNullable();
    table.string("name", 90).notNullable();
    table.string("emp_id", 255);
    table
      .foreign("campaign_id")
      .references("id")
      .inTable(RELATED_TABLES.CAMPAIGNS)
      .onDelete("CASCADE");
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
