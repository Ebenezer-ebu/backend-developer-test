import session from "express-session";
import * as redis from "redis";
import connectRedis from "connect-redis";

const RedisStore = connectRedis(session);

// configure redis
const redisClient = redis.createClient();

redisClient.connect()

// Session middleware
export = session({
  store: new RedisStore({
    client: redisClient as any,
    disableTouch: true,
  }),
  secret: "mySecret",
  saveUninitialized: false,
  resave: false,
  name: "sessionId",
  cookie: {
    secure: false, // if true: only transmit cookies over https
    httpOnly: true, // if true: prevent client js fron reading the cookie
    maxAge: 1000 * 60 * 30,
  },
});
