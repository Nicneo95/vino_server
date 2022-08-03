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
  return db.addColumn('product', 'producer_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'product_producer_fk',
      table: 'producer',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      },
      mapping: 'producer_id'
    }
  }).then(() => {
    db.addColumn('product', 'category_id', {
      type: 'smallint',
      unsigned: true, 
      notNull: true,
      foreignKey: {
        name: 'product_category_fk',
        table: 'category',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'category_id'
      }
    })
  }).then(() => {
    db.addColumn('product', 'region_id', {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_region_fk',
        table: 'region',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'region_id'
      }
    })
  }).then(() => {
    db.addColumn('product', 'country_id', {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_country_fk',
        table: 'country',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'country_id'
      }
    })
  });
};

exports.down = function(db) {
  return db.removeForeignKey('product', 'product_producer_fk')
            .then(() => {
              db.removeColumn('product', 'producer_id')
            })
            .then(() => {
              db.removeForeignKey('product', 'product_category_fk')
            })
            .then(() => {
              db.removeColumn('product', 'category_id')
            })
            .then(() => {
              db.removeForeignKey('product', 'product_region_fk')
            })
            .then(() => {
              db.removeColumn('product', 'region_id')
            })
            .then(() => {
              db.removeForeignKey('product', 'product_country_fk')
            })
            .then(() => {
              db.removeColumn('product', 'country_id')
            });
};

exports._meta = {
  "version": 1
};
