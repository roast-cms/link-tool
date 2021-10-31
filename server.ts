import * as express from "express";
import * as dotenv from "dotenv";
import linkTool from "@roast-cms/link-tool";

dotenv.config();

/**
  Parent Express application.
*/
const app = express();

/**
  This is the `link-tool` implementation.
*/
app.use(
  linkTool({
    // REQUIRED redis server URL
    redisURL: process.env.REDIS_URL,

    // REQUIRED MongoDB URI
    databaseURI: process.env.DATABASE_URI,

    // REQUIRED application secret (random string for app session ID)
    applicationSecret: process.env.APPLICATION_SECRET,

    // OPTIONAL path name for the `link-tool` API on local Express router
    pathName: "/recommends",
  })
);

/**
  Parent server intialization.
*/
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on :${port}`);
});
