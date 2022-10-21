"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
// import { PrismaClient } from "@prisma/client";
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
// import * as redis from "redis";
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
// const prisma = new PrismaClient();
const app = (0, express_1.default)();
const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
// const redisClient = redis.createClient({ legacyMode: true });
const redis = new ioredis_1.default();
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
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    app.set("trust proxy", true);
    // SendEmail("bob@test.com", "Hello there");
    app.use((0, express_session_1.default)({
        name: "qid",
        store: new RedisStore({ client: redis, disableTouch: true }),
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            // sameSite: "none",
            secure: false,
        },
        secret: "jdfkajdk335jkadjf",
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res, redis }),
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: corsOptions });
    app.listen(4000, () => {
        console.log("server started on localhost:4000");
    });
});
main();
