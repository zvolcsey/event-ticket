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
  pgm.createType('admin_roles', ['SUPER_ADMIN'])
  pgm.createType('status', ['active', 'inactive'])
  pgm.createType('purchase_status', ['pending', 'completed'])
  pgm.createType('seating_type', ['standing', 'seated'])
  pgm.createType('ticket_type', ['general', 'vip'])
  pgm.createType('expiration_status', ['pending', 'expired'])
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropType('admin_role')
  pgm.dropType('status')
  pgm.dropType('purchase_status')
  pgm.dropType('seating_type')
  pgm.dropType('ticket_type')
  pgm.dropType('expiration_status')
}
