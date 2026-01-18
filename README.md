# API-DB-App

A simple Node.js Express API for managing scheduling groups with PostgreSQL database.

## Setup

1. Clone the repository.
2. Copy `.env.example` to `.env` and fill in your database credentials.
3. Run `docker-compose up --build` to start the application.
4. The API will be available at `http://localhost:3000`.

## Endpoints

- `POST /scheduling-groups`: Create a new scheduling group (body: { "group_name": "string", "created_by": "string" })
- `GET /scheduling-groups`: Retrieve all scheduling groups.

## Docker Hub

The image is available at `shekhardocker2020/api-db-postgress`. Pull and run with your own `.env` file.