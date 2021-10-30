import * as redis from "redis";
import * as dotenv from "dotenv";
import * as bluebird from "bluebird";

dotenv.config();

const client = redis.createClient({ url: process.env.REDIS_URL });
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export default client;
