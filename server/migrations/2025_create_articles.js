exports.up = function(knex) {
  return knex.schema.createTable('articles', function(t){
    t.string('id').primary();
    t.string('client');
    t.string('reference');
    t.text('designation');
    t.date('dateEntree');
    t.date('dateSortie');
    t.string('emplacement');
    t.integer('quantite').defaultTo(0);
    t.text('autresInfos');
    t.timestamp('last_modified').defaultTo(knex.fn.now());
    t.boolean('deleted').defaultTo(false);
    t.string('modified_by');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('articles');
};
