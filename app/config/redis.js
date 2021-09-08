import redis from 'redis'
import dotenv from "dotenv";
dotenv.config()
export const client = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD
})

client.on('error', (err) => {
	console.log("Error " + err)
});
