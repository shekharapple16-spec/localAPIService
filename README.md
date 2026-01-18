# API-DB-App

A simple Node.js Express API for managing scheduling groups with PostgreSQL database.

## Setup

1. Clone the repository.
2. Run `docker build -t yourname/single-api-db .` to build the combined image.
3. Run `docker run -p 3000:3000 yourname/single-api-db` to start the application.
4. The API will be available at `http://localhost:3000`.

## Endpoints

- `POST /scheduling-groups`: Create a new scheduling group (body: { "group_name": "string", "created_by": "string" })
- `GET /scheduling-groups`: Retrieve all scheduling groups.

## Docker Hub

The combined image is available at `yourname/single-api-db`. Pull and run with `docker run -p 3000:3000 yourname/single-api-db`.