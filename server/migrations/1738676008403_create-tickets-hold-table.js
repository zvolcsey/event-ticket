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
  pgm.createTable('tickets_hold', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: new PgLiteral('gen_random_uuid()'),
    },
    ticket_id: { type: 'uuid', notNull: true, references: '"tickets"' },
    hold_token: { type: 'uuid', notNull: true },
    quantity: { type: 'integer', notNull: true },
    status: { type: 'expiration_status', notNull: true, default: 'pending' },
    expires_at: { type: 'timestamptz', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: new PgLiteral('CURRENT_TIMESTAMP') },
  })
  pgm.createConstraint('tickets_hold', 'greater_than_zero_quantity', {
    check: 'quantity > 0',
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('tickets_hold')
  pgm.dropExtension('pgcrypto')
}
