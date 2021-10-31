// @ts-nocheck
import * as express from "express";
import * as redis from "redis";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import * as dotenv from "dotenv";

import Links from "./models/links";
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
    `${pathName || "/recommends"}/:link`,
    async (req: Request, res: Response) => {
      // query
      const linkID = req.params.link;
      const dbDocument = await Links.findOne({ link: linkID }).exec();

      // document not found
      if (!dbDocument || !dbDocument._doc)
        return res.status(404).json({
          status: 404,
        });

      // unwraps the response
      const doc = Object.assign({}, dbDocument._doc);

      /**
        Sorts vendors based on value you assign to them.
      */
      const topValuedVendor = doc.vendors.sort(
        (firstVendor: number, secondVendor: number) => {
          if (firstVendor.value < secondVendor.value) return 1;
          if (firstVendor.value > secondVendor.value) return -1;
          return 0;
        }
      )[0];

      // successful API response
      return res.json({
        status: 200,
        link: doc.link,
        vendor: {
          url: topValuedVendor.url,
          locale: topValuedVendor.locale,
          // you may not want to share the vale you place on various vendors
        },
      });
    }
  );

export default tool;
