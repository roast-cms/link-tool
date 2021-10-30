import * as mongoose from "mongoose";
import * as cachegoose from "cachegoose";
import redis from "./redis";

try {
  (async () => {
    cachegoose(mongoose, {
      engine: "redis",
      port: redis.options.port,
      host: redis.options.host,
      password: redis.options.password,
    });
  })();
} catch (error) {
  console.log(
    "Failed to connect `cachegoose` to Redis. Using local memory instead: ",
    error
  );
  cachegoose(mongoose);
}

const connection = mongoose.createConnection(process.env.DATABASE_URI);
export default connection;
