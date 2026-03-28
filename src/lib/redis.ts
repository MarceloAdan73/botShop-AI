type RedisType = {
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
  ttl: (key: string) => Promise<number>;
} | null;

let redis: RedisType = null;

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (redisUrl && redisToken && redisUrl.startsWith('http')) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Redis = require('ioredis');
    redis = new Redis(redisUrl, {
      password: redisToken,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    }) as unknown as RedisType;
  } catch (error) {
    console.error("Error conectando a Redis:", error);
    redis = null;
  }
}

export default redis;
