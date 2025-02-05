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
  pgm.createTable('bands', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: new PgLiteral('gen_random_uuid()'),
    },
    name: { type: 'varchar(255)', notNull: true, unique: true },
    slug: { type: 'varchar(255)', notNull: true },
    status: { type: 'status', default: 'active' },
    description: { type: 'text' },
    image: { type: 'varchar(255)' },
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
  pgm.createIndex('bands', 'name')
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('bands')
  pgm.dropExtension('pgcrypto')
}
