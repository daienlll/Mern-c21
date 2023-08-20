const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { ApolloServer } = require("apollo-server-express");
const { Auth } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");

const apolloserver = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: Auth,
  });
  
  const app = express();
  const PORT = process.env.PORT || 3001;
  
  await server.start()
  
  server.applyMiddleware({ app });
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use(express.static(__dirname));
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }
  
  app.use(routes);
  
  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
  
}

apolloserver()