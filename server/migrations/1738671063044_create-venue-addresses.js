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
  pgm.createTable('venue_addresses', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: new PgLiteral('gen_random_uuid()'),
    },
    address: { type: 'varchar(255)', notNull: true },
    city: { type: 'varchar(100)', notNull: true },
    state_province: { type: 'varchar(100)' },
    postal_code: { type: 'varchar(20)', notNull: true },
    country: { type: 'varchar(2)', notNull: true },
    created_at: {
      type: 'timestamptz',
      default: new PgLiteral('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamptz',
      default: new PgLiteral('CURRENT_TIMESTAMP'),
    },
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('venue_addresses')
  pgm.dropExtension('pgcrypto')
}
