import pool from '../index'
import type { QueryResult, QueryResultRow } from 'pg'
import { seedBands } from './bands-seed'
import { seedBandsEvents } from './bands-events-seed'
import { logSeededBands } from './seed-logs'

interface QueryResultRowWithIds extends QueryResultRow {
  id: string
}

interface QueryResultRowWithEventData extends QueryResultRow {
  event_name: string
  category_name: string
  venue_name: string
  bands: string[]
}

void (async () => {
  const client = await pool.connect()

  try {
    // Clear the tables
    await client.query('DELETE FROM bands_events;')
    await client.query('DELETE FROM events;')
    await client.query('DELETE FROM venues;')
    await client.query('DELETE FROM event_categories;')
    await client.query('DELETE FROM venue_addresses;')

    // Insert top-level categories
    const musicCategoryResult: QueryResult<QueryResultRowWithIds> = await client.query(`
      INSERT INTO event_categories (name, slug, parent_id)
      VALUES ('Music', 'music', NULL)
      RETURNING id;
    `)

    // Get the ID of the Music category
    const musicId = musicCategoryResult.rows[0].id

    // Insert subcategories
    const subcategoryIdsResult: QueryResult<QueryResultRowWithIds> = await client.query(
      `
      INSERT INTO event_categories (name, slug, parent_id)
      VALUES 
        ('Rock', 'rock', $1),
        ('Pop', 'pop', $2),
        ('Jazz', 'jazz', $3),
        ('Country', 'country', $4)
        RETURNING id;
    `,
      [musicId, musicId, musicId, musicId]
    )

    // Get the IDs of the subcategories
    const subcategoryIds = subcategoryIdsResult.rows.map((row) => row.id)

    // Insert venue addresses
    const venueAddressResult: QueryResult<QueryResultRowWithIds> = await client.query(`
      INSERT INTO venue_addresses (address, city, state_province, postal_code, country)
      VALUES 
        ('123 Main St', 'Springfield', 'IL', '62701', 'US'),
        ('456 Elm St', 'Miami', 'FL', '33101', 'US'),
        ('Petőfi Sándor utca 45', 'Budapest', NULL, '1052', 'HU'),
        ('123 Rue de la Paix', 'Paris', NULL, '75002', 'FR')
      RETURNING id;
    `)

    // Get the IDs of the venue addresses
    const venueAddresses = venueAddressResult.rows.map((row) => row.id)

    // Insert venues
    const venuesResult: QueryResult<QueryResultRowWithIds> = await client.query(
      `
      INSERT INTO venues (venue_address_id, name, slug, status)
      VALUES
        ($1, 'Springfield Convention Center', 'springfield-convention-center', 'active'),
        ($2, 'Miami Arena', 'miami-arena', 'active'),
        ($3, 'Budapest Music Center', 'budapest-music-center', 'active'),
        ($4, 'Paris Music Center', 'paris-music-center', 'active')
        RETURNING id;
    `,
      venueAddresses
    )

    // Get the IDs of the venues
    const venueIds = venuesResult.rows.map((row) => row.id)

    // Insert events
    const insertEventsResult: QueryResult<QueryResultRowWithIds> = await client.query(
      `
      INSERT INTO events (event_category_id, venue_id, name, slug, status, event_start, event_end, timezone, seating_type, description, image_url)
      VALUES
        ($1, $2, 'Country Concert', 'country-concert', 'active', '2025-09-09T19:00:00-00:00', '2025-09-09T23:00:00-00:00', 'America/Chicago', 'standing', 'A country concert featuring the best bands in the world.', NULL),
        ($3, $4, 'Pop Concert', 'pop-concert', 'active', '2025-09-10T19:00:00-00:00', '2025-09-10T23:00:00-00:00', 'Europe/Budapest', 'standing', 'A pop concert featuring the best bands in the world.', NULL),
        ($5, $6, 'Jazz Concert', 'jazz-concert', 'active', '2025-09-11T19:00:00-00:00','2025-09-11T23:00:00-00:00', 'Europe/Paris', 'standing', 'A jazz concert featuring the best bands in the world.', NULL),
        ($7, $8, 'Summer Concert', 'summer-concert', 'active', '2025-07-12T19:00:00-05:00','2025-07-12T23:00:00-00:00', 'America/New_York', 'standing', 'A summer rock concert featuring the best bands in the world.', NULL)
      RETURNING id;
        `,
      [
        subcategoryIds[3],
        venueIds[0],
        subcategoryIds[1],
        venueIds[2],
        subcategoryIds[2],
        venueIds[3],
        musicId,
        venueIds[1],
      ]
    )

    // Get the IDs of the events
    const eventIds = insertEventsResult.rows.map((row) => row.id)

    // Seed the bands and get the IDs and the names
    const bandData = await seedBands(client)

    // Seed the bands_events
    await seedBandsEvents(client, bandData, eventIds)

    // Query the events
    const selectEventsResult: QueryResult<QueryResultRowWithEventData> = await client.query(`
      SELECT 
        events.name AS event_name, category.name AS category_name, venues.name AS venue_name,
        COALESCE(bands.bands, ARRAY[]::text[]) AS bands
      FROM events AS events
      INNER JOIN event_categories AS category ON events.event_category_id = category.id
      INNER JOIN venues AS venues ON events.venue_id = venues.id
      LEFT JOIN (
        SELECT bands_events.event_id, ARRAY_AGG(bands.name) AS bands
        FROM bands_events
        INNER JOIN bands ON bands_events.band_id = bands.id
        GROUP BY bands_events.event_id
      ) AS bands ON events.id = bands.event_id;
    `)

    // Log the events
    console.log('Events in the database:')
    selectEventsResult.rows.forEach((row) => {
      console.log(`\u{1F389} ${row.event_name} (${row.category_name}) at ${row.venue_name}`)
      console.log(`Bands: ${row.bands.join(', ')}`)
    })

    // Log the bands
    logSeededBands(bandData)
  } catch (error) {
    console.error('\u{274C} Error events seed', error)
  } finally {
    client.release()
  }
})()
