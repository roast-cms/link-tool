import * as mongoose from "mongoose";
import * as cachegoose from "cachegoose";

const connectMongoose = ({
  databaseURI,
  redisURL,
}: {
  databaseURI: string;
  redisURL: string;
}) => {
  try {
    (async () => {
      const { createRedisClient } = require("./redis");
      const redis = await createRedisClient({ redisURL });
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

  const connection = mongoose.createConnection(databaseURI);
  return connection;
};

export default connectMongoose;
