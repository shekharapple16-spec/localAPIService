FROM node:18-alpine

# Install postgres
RUN apk add --no-cache postgresql postgresql-contrib

# Create postgres data directory
RUN mkdir -p /var/lib/postgresql/data && chown postgres:postgres /var/lib/postgresql/data
RUN mkdir -p /run/postgresql && chown postgres:postgres /run/postgresql

# Switch to postgres user to init db
USER postgres
RUN initdb -D /var/lib/postgresql/data

# Switch back to root
USER root

# Set up app
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Create entrypoint script
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Start postgres' >> /entrypoint.sh && \
    echo 'if su postgres -c "pg_ctl -D /var/lib/postgresql/data -l /tmp/postgres.log start"; then' >> /entrypoint.sh && \
    echo '  echo "Postgres started"' >> /entrypoint.sh && \
    echo 'else' >> /entrypoint.sh && \
    echo '  echo "Failed to start postgres, log:"' >> /entrypoint.sh && \
    echo '  cat /tmp/postgres.log' >> /entrypoint.sh && \
    echo '  exit 1' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Wait for postgres to be ready' >> /entrypoint.sh && \
    echo 'until pg_isready -h localhost -p 5432; do echo "Waiting for postgres..."; sleep 1; done' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Create database if not exists' >> /entrypoint.sh && \
    echo 'su postgres -c "createdb -O postgres automation_practice 2>/dev/null || true"' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Run init script' >> /entrypoint.sh && \
    echo 'su postgres -c "psql -d automation_practice -f /app/init-db.sql"' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Start API' >> /entrypoint.sh && \
    echo 'node server.js' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 3000

CMD ["/entrypoint.sh"]