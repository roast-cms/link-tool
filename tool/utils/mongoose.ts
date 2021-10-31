import * as mongoose from "mongoose";
import * as cachegoose from "cachegoose";
import * as dotenv from "dotenv";

dotenv.config();

try {
  (async () => {
    const redis = await require("./redis");
    cachegoose(mongoose, {
      engine: "redis",
      port: redis.default.options.port,
      host: redis.default.options.host,
      password: redis.default.options.password,
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
