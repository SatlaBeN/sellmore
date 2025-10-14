
import { RateLimiterMemory } from "rate-limiter-flexible";

const max = Number(process.env.RATE_LIMIT_MAX || 60);
const limiter = new RateLimiterMemory({ points: max, duration: 60 });

export async function limit(key: string): Promise<void> {
  await limiter.consume(key);
}
