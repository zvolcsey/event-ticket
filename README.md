# Event Ticket

## Overview

> ### React + Node.js + Express + PostgreSQL fullstack e-commerce portfolio project

## Table of Contents

1. [Routing](#routing)
2. [Run locally](#run-locally)
3. [Ports](#ports)
4. [License](#license)

## Routing

TODO

## Run locally

You need have Node.js 20 or higher installed.

This project uses Docker compose for development.

```bash
  # Clone the repository
  git clone git@github.com:zvolcsey/event-ticket.git
  cd event-ticket

  # Run `docker compose up` in detached mode
  docker compose -f docker-compose.dev.yml up --build -d

  # Stop and remove the containers
  docker compose -f docker-compose.dev.yml down
  # Remove all data
  docker compose -f docker-compose.dev.yml down -v
```

This is going to do the next things.

1.  Build and start all necessary containers:

- Client (**event-ticket-client**)
- Server (**event-ticket-server**)
- PostgreSQL database (**event-ticket-postgres**)

2. Create the following tables and custom types from the migrations files.

- Tables
  - admin_users
  - bands
  - bands_events
  - customers
  - event_categories
  - events
  - ordered_items
  - orders
  - pgmigrations
  - tickets
  - tickets_hold
  - venue_addresses
  - venues

The migrations files are available in the [migrations](./server/migrations/) folder.

3. Add seed data to the database

The following data are going to added:
  - categories
  - venues
  - events
  - bands
  - Connect the bands to the events in the bands_events table.

Order in the [events_seed.ts](./server/src/db/seeds/events-seed.ts) file: categories -> venues -> events -> bands -> bands_events

The seeded data is going to be logged when running docker-compose.

The seed files are available in the [seeds](./server/src/db/seeds/) folder.

## License

MIT License
