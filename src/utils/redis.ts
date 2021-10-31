import * as redis from "redis";
import * as bluebird from "bluebird";

export const createRedisClient = async ({ redisURL }: { redisURL: string }) => {
  const client = redis.createClient({ url: redisURL });
  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);

  return client;
};
