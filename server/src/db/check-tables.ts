import pool from './index'

void (async () => {
  const client = await pool.connect()

  try {
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `

    const result = await client.query(query)

    console.log('Tables in the database:')
    result.rows.forEach((row) => {
      console.log('\u{1F5C3}', row.table_name)
    })
  } catch (error) {
    console.error('\u{274C} Error checking tables', error)
  } finally {
    client.release()
  }
})()
