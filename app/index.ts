import * as express from "express";
import * as redis from "redis";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import * as dotenv from "dotenv";

import Link from "./models/link";
import { Request, Response } from "express";

dotenv.config();

const expressApp = express();
const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

/**
  Set up Redis connection.
*/
expressApp.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.APPLICATION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

/**
  Plug in to Express router.
*/
const tool = ({ pathName }: { pathName: string }) =>
  expressApp.get(
    `${pathName || "/recommends"}/:key`,
    async (req: Request, res: Response) => {
      const key = req.params.key;
      const link = await Link.findOne({ key }).exec();
      console.log("link", link);

      return res.json({
        status: "ok",
        key,
        link,
      });
    }
  );

export default tool;
