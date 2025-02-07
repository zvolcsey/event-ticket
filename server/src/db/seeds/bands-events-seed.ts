import type { PoolClient } from 'pg'

export async function seedBandsEvents(
  client: PoolClient,
  bandData: { id: string; name: string }[],
  eventIds: string[]
): Promise<void> {
  // Insert bands
  await client.query(
    `
      INSERT INTO bands_events (band_id, event_id)
      VALUES 
        ($1, $2),
        ($3, $4),
        ($5, $6),
        ($7, $8),
        ($9, $10);
      `,
    [
      bandData[3].id,
      eventIds[0],
      bandData[2].id,
      eventIds[1],
      bandData[0].id,
      eventIds[2],
      bandData[1].id,
      eventIds[3],
      bandData[3].id,
      eventIds[3],
    ]
  )
}
