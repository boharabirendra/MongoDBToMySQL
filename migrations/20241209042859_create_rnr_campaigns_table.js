const TABLE_NAME = 'rnr_campaigns';

/**
 * Create table <table_name>.
 *
 * @param  {object} knex
 * @return {Promise}
 */
function up(knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.string('id', 36).primary();
    table.string('name', 25).notNullable().unique();
    table.string('rewardee_message', 200).notNullable();
    table
      .enu('status', ['COMPLETED', 'IN_PROGRESS', 'NOT_STARTED'])
      .notNullable()
      .defaultTo('NOT_STARTED');
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.integer('number_of_rewardee').notNullable();
    table.integer('number_of_appreciation').notNullable();
    table.integer('max_appreciation_per_employee').notNullable();
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
