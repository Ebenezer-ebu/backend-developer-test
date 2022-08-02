import createError, { HttpError } from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import session from "express-session";
import * as redis from "redis";
import connectRedis from "connect-redis";
import cookieParser from "cookie-parser";
import logger from "morgan";

import teamRouter from "./routes/team";
import linkRouter from "./routes/links";
import usersRouter from "./routes/users";
import searchRouter from "./routes/search";
import fixtureRouter from "./routes/fixtures";

const app = express();

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

// configure redis
export const redisClient = redis.createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

const RedisStore = connectRedis(session);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());

// Session middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient as any }),
    secret: "mySecret",
    saveUninitialized: false,
    resave: false,
    name: "sessionId",
    cookie: {
      secure: false, // if true: only transmit cookies over https
      httpOnly: false, // if true: prevent client js fron reading the cookie
      maxAge: 1000 * 60 * 30,
    },
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", teamRouter);
app.use("/", linkRouter);
app.use("/", searchRouter);
app.use("/", fixtureRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export { app };
