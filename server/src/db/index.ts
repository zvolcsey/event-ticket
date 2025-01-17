import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

pool.on('connect', () => {
  console.log('\u{2705} Connected to the db')
})

pool.on('error', (error) => {
  console.error('\u{274C} Unexpected error on idle client', error)
  process.exit(-1)
})

export default pool
