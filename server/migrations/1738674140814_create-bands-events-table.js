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
  pgm.createTable('bands_events', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: pgm.func('gen_random_uuid()'),
    },
    band_id: { type: 'uuid', notNull: true, references: '"bands"' },
    event_id: { type: 'uuid', notNull: true, references: '"events"' },
    created_at: {
      type: 'timestamptz',
      default: new PgLiteral('CURRENT_TIMESTAMP'),
    },
  })
  pgm.addConstraint('bands_events', 'unique_band_id_event_id', {
    unique: ['band_id', 'event_id'],
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('bands_events')
  pgm.dropExtension('pgcrypto')
}
