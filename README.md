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

This is going to build and start all necessary containers:

- Client (**react-shop-client**)
- Server (**react-shop-server**)
- PostgreSQL database (**react-shop-postgres**)

## License

MIT License
