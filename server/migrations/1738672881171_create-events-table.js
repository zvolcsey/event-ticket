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
  pgm.createTable('events', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: new PgLiteral('gen_random_uuid()'),
    },
    event_category_id: { type: 'uuid', notNull: true, references: '"event_categories"' },
    venue_id: { type: 'uuid', notNull: true, references: '"venues"' },
    name: { type: 'varchar(255)', notNull: true },
    slug: { type: 'varchar(255)', notNull: true },
    status: { type: 'status', notNull: true, default: 'active' },
    event_start: {
      type: 'timestamptz',
      notNull: true,
    },
    event_end: {
      type: 'timestamptz',
      notNull: true,
    },
    timezone: { type: 'varchar(255)', notNull: true },
    seating_type: { type: 'seating_type', notNull: true, default: 'standing' },
    description: { type: 'text' },
    image_url: { type: 'varchar(255)' },
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
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('events')
  pgm.dropExtension('pgcrypto')
}
