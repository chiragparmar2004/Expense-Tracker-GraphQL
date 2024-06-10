import { ApolloServer } from "@apollo/server";

import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { GraphQLLocalStrategy, buildContext } from "graphql-passport";

import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import { connectDb } from "./db/connectDb.js";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import passport from "passport";
import { configurePassport } from "./passport/passport.config.js";

dotenv.config();
configurePassport();
const app = express();

const MongoDBStore = ConnectMongoDBSession(session);

const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: "session",
});

store.on("error", (err) => console.log(err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();
configurePassport;
app.use(
  "/",
  cors({
    origin: "https://localhost:3000",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// Modified server startup

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDb();

console.log(`🚀 Server ready at http://localhost:4000/`);
