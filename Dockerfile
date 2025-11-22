FROM node:18-alpine

RUN mkdir -p /famvis
WORKDIR /famvis

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Environment variables
ENV FAMVIS_NEO4J_CONNECTION=neo4j:7687
ENV FAMVIS_NEO4J_USER=neo4j
ENV FAMVIS_NEO4J_PWD=neo4jLocalPwd

ENV FAMVIS_MARIADB_HOST=mariadb
ENV FAMVIS_MARIADB_USER=family
ENV FAMVIS_MARIADB_PWD=family

ENV PORT=80
ENV NODE_ENV=production

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S famvis -u 1001
RUN chown -R famvis:nodejs /famvis
USER famvis

EXPOSE $PORT

CMD [ "npm", "start" ]