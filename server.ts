import * as express from "express";
import tool from "./app";

// eslint-disable-next-line
require("dotenv").config();

const app = express();
app.get("/recommends/:key", tool);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on :${port}`);
});
