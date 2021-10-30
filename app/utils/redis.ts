import { promisify } from "util";
import * as redis from "redis";

const client = redis.createClient({ url: process.env.REDIS_URL });
const asyncRedis = promisify(client.get).bind(client);

export default asyncRedis;
