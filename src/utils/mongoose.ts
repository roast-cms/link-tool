import * as mongoose from "mongoose";

const databaseURI = process.env.DATABASE_URI || "";
const cachegoose = require("cachegoose");
try {
  const client = require("./redis");
  cachegoose(mongoose, {
    engine: "redis",
    port: client.options.port,
    host: client.options.host,
    password: client.options.password,
  });
} catch (error) {
  console.log(
    "Failed to connect `cachegoose` to Redis. Using local memory instead: ",
    error
  );
  cachegoose(mongoose);
}

const connection = mongoose.createConnection(databaseURI);
export default connection;
