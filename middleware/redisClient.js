const { createClient } = require("redis");
console.log(process.env.REDIS_PORT);
const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
});

async function closeClient() {
  await new Promise((resolve) => {
    redis.quit(() => {
      resolve();
    });
  });
  // redis.quit() creates a thread to close the connection.
  // We wait until all threads have been run once to ensure the connection closes.
  await new Promise((resolve) => setImmediate(resolve));
}

redisClient.connect().catch(console.error);

//Logs Redis Connection
redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});
redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

module.exports = { redisClient, closeClient };
