import * as redis from "redis";
import * as bluebird from "bluebird";

require("dotenv").config();
const redisURL = process.env.REDIS_URL || "";
const client = redis.createClient({ url: redisURL });
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export default client;
