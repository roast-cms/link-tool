import * as express from "express";
import links from "@roast-cms/links";

require("dotenv").config();

/**
  Parent Express application.
*/
const app = express();

/**
  This is the `links` middleware implementation.
*/
app.use(
  links({
    // OPTIONAL path name for the API on local Express router
    pathName: "/link", // this is the default path to API
  })
);

/**
  Parent server intialization.
*/
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on :${port}`);
});
