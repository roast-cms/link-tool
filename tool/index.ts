const express = require("express");
const redis = require("redis");
const session = require("express-session");
const connectRedis = require("connect-redis");

import Links from "./models/links";
import { Request, Response } from "express";

/**
  Returns Express router middleware.
*/
const tool = ({
  pathName,
  redisURL,
  databaseURI,
  applicationSecret,
}: {
  pathName: string | undefined;
  redisURL: string;
  databaseURI: string;
  applicationSecret: string;
}) => {
  if (!redisURL || !databaseURI || !applicationSecret)
    throw {
      error:
        "Required `redisURL`, `databaseURI`, or `applicationSecret` missing.",
    };

  // set up Redis connection.
  const expressApp = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    url: redisURL,
  });
  expressApp.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: applicationSecret,
      resave: false,
      saveUninitialized: false,
    })
  );

  return expressApp.get(
    `${pathName || "/recommends"}/:link`,
    async (req: Request, res: Response) => {
      // query
      const linkID = req.params.link;
      const dbDocument = await Links({
        databaseURI,
        redisURL,
      })
        .findOne({ link: linkID })
        .exec();

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
};

export default tool;
