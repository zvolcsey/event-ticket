import pool from './index'
import type { QueryResult, QueryResultRow } from 'pg'

interface QueryResultRowWithIds extends QueryResultRow {
  id: string
}

interface QueryResultRowWithName extends QueryResultRow {
  event_name: string
  category_name: string
  venue_name: string
}

void (async () => {
  const client = await pool.connect()

  try {
    // Clear the tables
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
    await client.query(
      `
      INSERT INTO events (event_category_id, venue_id, name, slug, status, event_start, event_end, timezone, seating_type, description, image_url)
      VALUES
        ($1, $2, 'Country Concert', 'country-concert', 'active', '2025-09-09T19:00:00-00:00', '2025-09-09T23:00:00-00:00', 'America/Chicago', 'standing', 'A country concert featuring the best bands in the world.', NULL),
        ($3, $4, 'Pop Concert', 'pop-concert', 'active', '2025-09-10T19:00:00-00:00', '2025-09-10T23:00:00-00:00', 'Europe/Budapest', 'standing', 'A pop concert featuring the best bands in the world.', NULL),
        ($5, $6, 'Jazz Concert', 'jazz-concert', 'active', '2025-09-11T19:00:00-00:00','2025-09-11T23:00:00-00:00', 'Europe/Paris', 'standing', 'A jazz concert featuring the best bands in the world.', NULL),
        ($7, $8, 'Summer Rock Concert', 'summer-rock-concert', 'active', '2025-07-12T19:00:00-05:00','2025-07-12T23:00:00-00:00', 'America/New_York', 'standing', 'A summer rock concert featuring the best bands in the world.', NULL);
      `,
      [
        subcategoryIds[3],
        venueIds[0],
        subcategoryIds[1],
        venueIds[2],
        subcategoryIds[2],
        venueIds[3],
        subcategoryIds[0],
        venueIds[1],
      ]
    )

    // Query the events
    const eventsResult: QueryResult<QueryResultRowWithName> = await client.query(`
      SELECT events.name AS event_name, category.name AS category_name, venues.name AS venue_name
      FROM events AS events
      INNER JOIN event_categories AS category ON events.event_category_id = category.id
      INNER JOIN venues AS venues ON events.venue_id = venues.id;
    `)

    // Log the events
    console.log('Events in the database:')
    eventsResult.rows.forEach((row) => {
      console.log(`\u{1F389} ${row.event_name} (${row.category_name}) at ${row.venue_name}`)
    })
  } catch (error) {
    console.error('\u{274C} Error events seed', error)
  } finally {
    client.release()
  }
})()
