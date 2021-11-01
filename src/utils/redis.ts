import * as redis from "redis";
import * as bluebird from "bluebird";

const redisURL = process.env.REDIS_URL || "";
const client = redis.createClient({ url: redisURL });
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export default client;
