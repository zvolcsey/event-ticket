import { PgLiteral } from 'node-pg-migrate'

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createExtension('pgcrypto', { ifNotExists: true })
  pgm.createTable('event_categories', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: new PgLiteral('gen_random_uuid()'),
    },
    name: { type: 'varchar(255)', notNull: true, unique: true },
    slug: { type: 'varchar(255)', notNull: true },
    parent_id: {
      type: 'uuid',
      references: '"event_categories"',
      default: new PgLiteral('NULL'),
      onDelete: new PgLiteral('SET NULL'),
    },
    created_at: {
      type: 'timestamptz',
      default: new PgLiteral('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamptz',
      default: new PgLiteral('CURRENT_TIMESTAMP'),
    },
    deleted_at: {
      type: 'timestamptz',
      default: new PgLiteral('NULL'),
    },
  })
  pgm.addConstraint('event_categories', 'unique_name_parent_id', {
    unique: ['name', 'parent_id'],
  })
  pgm.createIndex('event_categories', 'name')
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('event_categories')
  pgm.dropExtension('pgcrypto')
}
