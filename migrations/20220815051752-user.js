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
  return db.createTable('user', {
    id: { type: 'int', unsigned: true, autoIncrement: true, primaryKey: true },
    first_name: { type: 'string', length: 255, notNull: true },
    last_name: { type: 'string', length: 255, notNull: true },
    email: { type: 'string', length: 320, notNull: true },
    password: { type: 'string', length: 64, notNull: true }, 
    user_type_id:{ type: "int", notNull: true, unsigned: true,
    foreignKey: {
        name: "user_user_type_fk",
        table: "user_type",
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('user');
};

exports._meta = {
  "version": 1
};