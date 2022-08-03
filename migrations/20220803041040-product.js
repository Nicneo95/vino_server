'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('product', {
    id: { type: 'int', unsigned: true, autoIncrement: true, primaryKey: true },
    name: { type: 'string', length: 255, notNull: true },
    nose_attribute: { type: 'string', length: 500, notNull: true },
    mouth_attribute: { type: 'string', length: 500, notNull: true },
    description: { type: 'string', length: 1000, notNull: true },
    alcohol_percentage: { type: 'string', length: 10, notNull: true },
    price: { type: 'int', unsigned: true, notNull: true },
    stock: { type: 'int', unsigned: true, notNull: true },
    vintage: { type: 'date', notNull: true },
    image_url: { type: 'string', length: 500 },
    thumbnail_url: { type: 'string', length: 500 },
    created_date: { type: 'datetime', notNull: true },
    modified_date: { type: 'datetime', notNull: true }
  });
};

exports.down = function(db) {
  return db.dropTable('product');
};

exports._meta = {
  "version": 1
};
