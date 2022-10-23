import * as express from "express";
// import links from "@roast-cms/links";

const links = require("./src").default;
require("dotenv").config();

/**
  Parent Express application.
*/
const app = express();

/**
  Example authentication middleware for authenticated routes (DELETE, PUT)
*/
const authenticationMiddleware = (
  _req: Request,
  _res: Response,
  next: Function
) => {
  // everyone's authenticated (UNSAFE, EXAMPLE USE ONLY)
  next();
};

/**
  This is the `links` middleware implementation.
*/
app.use(
  links({
    // REQUIRED redis server URL
    redisURL: process.env.REDIS_URL || "",

    // REQUIRED MongoDB URI
    databaseURI: process.env.DATABASE_URI || "",

    // REQUIRED application secret (random string for app session ID)
    applicationSecret: process.env.APPLICATION_SECRET || "",

    // OPTIONAL path name for the `links` API on local Express router
    pathName: "/link", // this is the default path to API

    // OPTIONAL authentication middleware to secure endpoints that allowe link edits
    authenticationMiddleware,
  })
);

/**
  Parent server intialization.
*/
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on :${port}`);
});
