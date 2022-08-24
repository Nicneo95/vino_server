'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("orders", {
    id: { type: 'int', unsigned: true, autoIncrement: true, primaryKey: true },
    total_amount: { type: "int", unsigned: true, notNull: true },
    payment_reference: { type: 'text', notNull: true },
    order_status_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "order_order_status_fk",
        table: "order_status",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
      },
    },
    user_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "order_user_fk",
        table: "user",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
      },
    },
    notes: { type: 'string', length: '500' },
    shipping_address: { type: "string", length: 500, notNull: true },
    date_placed: { type: "datetime", notNull: true },
    date_updated: { type: "datetime", notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable("orders");
};

exports._meta = {
  "version": 1
};