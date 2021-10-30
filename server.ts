import * as express from "express";
import * as dotenv from "dotenv";
import tool from "./app";

dotenv.config();

/**
  Parent Express application.
*/
const app = express();

/**
  This is the `link-tool` implementation.
*/
app.use(
  tool({
    pathName: "/recommends", // path name for the `link-tool` API on local Express router
  })
);

/**
  Parent server intialization.
*/
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on :${port}`);
});
