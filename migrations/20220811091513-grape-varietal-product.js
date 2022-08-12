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
  return db.createTable('grape_varietal_product', {
    id: { type: 'int', unsigned: true, autoIncrement: true, primaryKey: true },
    grape_varietal_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      defaultValue: 1,
      foreignKey: {
        name: 'grape_varietal_product_grape_varietal_fk',
        table: 'grape_varietal',
        mapping: 'id',
        rules:{
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }
    },
    product_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      defaultValue: 1,
      foreignKey: {
        name: 'grape_varietal_product_product_fk',
        table: 'product',
        mapping: 'id',
        rules:{
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('grape_varietal_product');
};

exports._meta = {
  "version": 1
};