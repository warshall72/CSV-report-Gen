import Config from './env';
import { createClient } from 'redis';

const redisClient = createClient({ url: Config.REDIS_URL });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect on module load, but wrap in async wrapper if needed in entry point
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (e) {
        console.error('Redis connection failed:', e);
    }
})();

export default redisClient;
