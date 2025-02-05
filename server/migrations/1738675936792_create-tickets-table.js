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
  pgm.createTable('tickets', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: new PgLiteral('gen_random_uuid()'),
    },
    event_id: { type: 'uuid', notNull: true, references: '"events"' },
    type: { type: 'ticket_type', notNull: true, default: 'general' },
    price: { type: 'numeric', notNull: true },
    available_quantity: { type: 'integer', notNull: true },
    total_quantity: { type: 'integer', notNull: true },
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
  pgm.createIndex('tickets', 'price')
  pgm.createIndex('tickets', 'type')
  pgm.addConstraint('tickets', 'check_ticket_quantity', {
    check: 'available_quantity <= total_quantity',
  })
  pgm.addConstraint('tickets', 'unique_event_type', {
    unique: ['event_id', 'type'],
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('tickets')
  pgm.dropExtension('pgcrypto')
}
