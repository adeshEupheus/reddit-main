import "reflect-metadata";
// import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-express";
import express from "express";
// import * as redis from "redis";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import cors from "cors";
import { SendEmail } from "./utils/sendEmail";

// const prisma = new PrismaClient();
const app = express();
const RedisStore = connectRedis(session);
// const redisClient = redis.createClient({ legacyMode: true });
const redis = new Redis();

// (async () => {
//   await redis.connect();
// })();

const corsOptions = {
  origin: ["https://studio.apollographql.com", "http://localhost:3000"],
  // origin: "http://localhost:3000",
  credentials: true,
};

// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   })
// )
const main = async () => {
  app.set("trust proxy", true);

  // SendEmail("bob@test.com", "Hello there");
  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redis as any, disableTouch: true }),
      saveUninitialized: false,

      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day

        httpOnly: true,
        // sameSite: "none",
        secure: false,
      },
      secret: "jdfkajdk335jkadjf",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: corsOptions });
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main();
