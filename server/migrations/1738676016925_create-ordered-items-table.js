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
  pgm.createTable('ordered_items', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: new PgLiteral('gen_random_uuid()'),
    },
    order_id: { type: 'uuid', notNull: true, references: '"orders"' },
    ticket_id: { type: 'uuid', notNull: true, references: '"tickets"' },
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
  pgm.dropTable('ordered_items')
  pgm.dropExtension('pgcrypto')
}
