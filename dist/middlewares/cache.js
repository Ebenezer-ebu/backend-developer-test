"use strict";
// import { Request, Response, NextFunction } from "express";
// import { redisClient } from '../app';
// // Cache middleware
// function cache(req: Request, res: Response, next: NextFunction) {
//   const { username } = req.params;
//   redisClient.get(username, (err, data) => {
//     if (err) throw err;
//     if (data !== null) {
//       res.send(setResponse(username, data));
//     } else {
//       next();
//     }
//   });
// }
