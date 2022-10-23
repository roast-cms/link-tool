// @ts-nocheck
import * as express from "express";
import * as redis from "redis";
import * as session from "express-session";
import * as connectRedis from "connect-redis";

import Links from "./models/links";
import { Request, Response } from "express";

require("dotenv").config();

/**
  Returns Express router middleware.
*/
const links = ({
  pathName,
  redisURL,
  databaseURI,
  applicationSecret,
  authenticationMiddleware,
}: {
  pathName?: string;
  redisURL: string;
  databaseURI: string;
  applicationSecret?: string;
  authenticationMiddleware?: Function;
}) => {
  if (!redisURL || !databaseURI || !applicationSecret)
    throw {
      error:
        "Required `redisURL`, `databaseURI`, or `applicationSecret` missing from `.env` file.",
    };

  // set up Redis connection.
  const linksApp = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    url: redisURL,
  });
  linksApp.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: applicationSecret,
      resave: false,
      saveUninitialized: false,
    })
  );

  /**
    Public endpoints.
  */
  linksApp.get(
    `${pathName || "/link"}/:link`,
    async (req: Request, res: Response) => {
      // query
      const linkID = req.params.link;
      const linkTag = req.query.tag;
      const linkVendors = req.query.vendors;
      const bulkLinkList = req.query.links;

      /**
        Bulk request for multiple link IDs.
      */
      if (linkID === "bulk" && bulkLinkList) {
        const linkIDs: string[] = bulkLinkList.split(",");
        if (!linkIDs.length)
          return res.json({
            status: 500,
            message: "No link IDs found.",
          });

        let status = 200;
        let message = undefined;

        if (linkIDs.length > 10) {
          status = 206;
          message = "Trimmed link ID list to the maximum of 10.";
          linkIDs = arr.slice(0, 10);
        }

        const dbDocuments =
          (await Links.find(
            {
              link: { $in: linkIDs },
            },
            { _id: 0 } // remove _id keys for the first level
          )
            .cache(60 * 10) // cache links for 10 min
            .exec()) || [];

        return res.json({
          status,
          message,
          group: dbDocuments.map(({ vendors, link, tags, title }) => ({
            link,
            title,
            vendors: (vendors || []).map(({ name, url, value }) => ({
              // explicitly define return keys
              name,
              url,
              value,
            })),
            tags,
          })),
        });
      }

      /**
        Group/list of links with a particular tag.
      */
      const isGroupRequest = linkTag && linkID === "group";
      const dbDocument = isGroupRequest
        ? await Links.find({ tags: { $in: [linkTag] } })
            .cache(60 * 10) // cache links for 10 min
            .exec()
        : await Links.findOne({ link: linkID })
            .cache(60 * 10) // cache links for 10 min
            .exec();
      if (isGroupRequest && dbDocument.length) {
        return res.json({
          status: 200,
          tag: linkTag,
          group: dbDocument.map(({ vendors, link, tags, title }) => ({
            title,
            link,
            vendors,
            tags,
          })),
        });
      }

      // document not found
      if (!dbDocument || !dbDocument._doc)
        return res.status(404).json({
          status: 404,
        });

      // unwraps the response
      const doc = Object.assign({}, dbDocument._doc);

      /**
        Shows all vendors.
      */
      if (linkVendors === "all")
        return res.json({
          status: 200,
          link: doc.link,
          title: doc.title,
          vendors: doc.vendors?.map(({ name, url, value, locale }) => ({
            name,
            url,
            value,
            locale,
          })),
          tags: doc.tags,
        });

      /**
        Sorts vendors based on value you assign to them & pics top-valued one.
      */
      const topValuedVendor = doc.vendors.sort(
        (firstVendor: number, secondVendor: number) => {
          if (firstVendor.value < secondVendor.value) return 1;
          if (firstVendor.value > secondVendor.value) return -1;
          return 0;
        }
      )[0];

      /**
        TODO:
        Add a condition where if the locale is specified, and it exists
        in the list of vendors, matching results get bumped above other vendors
        in the list.
      */

      // successful API response
      return res.json({
        status: 200,
        link: doc.link,
        title: doc.title,
        vendor: {
          url: topValuedVendor.url,
          locale: topValuedVendor.locale,
          name: topValuedVendor.name,
          tags: topValuedVendor.tags,
          // you may not want to share the vale you place on various vendors
        },
      });
    }
  );

  /**
    Autenticated endpoints.
  */
  linksApp.delete(
    `${pathName || "/link"}/:link`,
    authenticationMiddleware ? authenticationMiddleware : () => {},
    async (req: Request, res: Response) => {
      // query
      const linkID = req.params.link;

      // authenticate
      if (req.user?.role !== "admin") {
        return res.status(401).json({ status: 401 });
      }

      const dbDocument = await Links.findOne({ link: linkID })
        .cache(60 * 10) // cache links for 10 min
        .exec();

      // document not found
      if (!dbDocument || !dbDocument._doc)
        return res.status(404).json({
          status: 404,
        });

      return res.json({ status: 200, link: linkID });
    }
  );

  return linksApp;
};

export default links;
