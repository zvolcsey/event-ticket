# React Shop

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
  git clone git@github.com:zvolcsey/react-shop.git
  cd react-shop

  # Run `docker compose up` in detached mode
  docker compose -f docker-compose.dev.yml up --build -d

  # Stop and remove the containers
  docker compose -f docker-compose.dev.yml down
  # Remove all data
  docker compose -f docker-compose.dev.yml down -v
```

This is going to do the next things

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

## License

MIT License
