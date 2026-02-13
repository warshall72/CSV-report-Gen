import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3000'),
    DATABASE_URL: z.string().url(),
    GROQ_API_KEY: z.string().min(1),
    REDIS_URL: z.string().url().default('redis://localhost:6379'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const env = envSchema.parse(process.env);

export default env;
