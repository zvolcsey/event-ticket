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
  pgm.createTable(
    'sessions',
    {
      sid: { type: 'text', notNull: true, primaryKey: true },
      sess: { type: 'json', notNull: true },
      expire: { type: 'timestamptz', notNull: true },
    },
    { oids: false }
  )

  pgm.createIndex('sessions', 'expire')
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('sessions')
}
