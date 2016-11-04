FROM node:4.6.1

RUN mkdir -p /famvis
WORKDIR /famvis
COPY package.json /famvis
RUN npm install

ENV FAMVIS_NEO4J_CONNECTION=neo4j:7687
ENV FAMVIS_NEO4J_USER=neo4j
ENV FAMVIS_NEO4J_PWD=gra91PH

ENV FAMVIS_MARIADB_HOST=mariadb
ENV FAMVIS_MARIADB_USER=family
ENV FAMVIS_MARIADB_PWD=family

ENV PORT=80

COPY . /famvis
EXPOSE $PORT

CMD [ "npm", "start" ]