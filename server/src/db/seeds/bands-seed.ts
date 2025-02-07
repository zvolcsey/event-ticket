import type { PoolClient, QueryResult, QueryResultRow } from 'pg'

interface QueryResultRowWithIds extends QueryResultRow {
  id: string
}

export async function seedBands(client: PoolClient): Promise<{ id: string; name: string }[]> {
  // Insert bands
  const bandsResult: QueryResult<QueryResultRowWithIds> = await client.query(
    `
      INSERT INTO bands (name, slug, status, description)
      VALUES 
        ('JazzBand', 'jazz-band', 'active', 'It is a Jazz Band'),
        ('RockBand', 'rock-band', 'active', 'It is a Rock Band'),
        ('PopBand', 'pop-band', 'active', NULL),
        ('CountryBand', 'country-band', 'active', 'It is a Country Band')
      RETURNING id, name;
      `
  )

  // Return the IDs and the names
  return bandsResult.rows.map((row) => ({ id: row.id, name: row.name }))
}
