import Redis from "ioredis"

const redisUrl = process.env.REDIS_URL
if (!redisUrl) throw new Error("Missing REDIS_URL in environment")

export const redis = new Redis(redisUrl)
export const redisSubscriber = new Redis(redisUrl) // needed for pub/sub
