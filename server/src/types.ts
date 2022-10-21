import { Request, Response } from "express";
// import { RedisClientType, RedisModules,  } from "@redis/client";
import { RedisClientType } from "redis";
import { Redis } from "ioredis";

export type MyContext = {
  req: Request;
  redis: Redis;
  // redisClient: any;
  res: Response;
};
