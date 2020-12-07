/* eslint-disable no-console */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const https = require('https');

const graphqlServer = require('./graphql');
const config = require('./config');
const app = require('./app');
const initializeDb = require('./config/database');

//MongoDB Database
initializeDb();

// Apollo Server
graphqlServer.applyMiddleware({
  app,
  cors: {
    origin: config.cors,
    credentials: true,
  },
});

const certOptions = {
  key: fs.readFileSync(path.resolve('ssl/server.key')),
  cert: fs.readFileSync(path.resolve('ssl/server.cert')),
};

const server = https.createServer(certOptions, app);

// Start Server
server.listen(config.port, () => {
  console.log(`\n Server is ready at https://localhost:${config.port} 🌏 \n`);
  console.log(
    `\u001b[1m\u001b[35m REST\u001b[0m Server running on https://localhost:${config.port}/api/v1 🌹`
  );
  console.log(
    `\u001b[1m\u001b[35m Graphql\u001b[0m Server running on https://localhost:${config.port}/graphql 🌻`
  );
});
