import express from "express";
import { Server } from "socket.io";
import { createServer } from "http"; // CORE MODULE
import cors from "cors";
import { newConnectionHandler } from "./socket/index";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers";
import passport from "passport";
import googleStrategy from "./lib/auth/googleOauth";
import userRouter from "./api/users/index";
import createHttpError from "http-errors";

const expressServer = express();
passport.use("google", googleStrategy);
// **************************** SOCKET.IO **************************
const httpServer = createServer(expressServer);
const socketioServer = new Server(httpServer); // this constructor expects to receive an HTTP-SERVER as parameter (NOT AN EXPRESS SERVER!!!!!)

socketioServer.on("connection", newConnectionHandler);

// *************************** MIDDLEWARES *************************
const whitelist = [process.env.FE_DEV_URL as string, process.env.FE_PROD_URL];
expressServer.use(
  cors({
    origin: (currentOrigin, corsNext) => {
      if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
        corsNext(null, true);
      } else {
        corsNext(
          createHttpError(
            400,
            `Origin ${currentOrigin} is not in the whitelist!`
          )
        );
      }
    },
  })
);
expressServer.use(express.json());
expressServer.use(passport.initialize());

// *************************** ENDPOINTS ***************************
expressServer.use("/users", userRouter);

// ************************* ERROR HANDLERS ************************
expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(forbiddenHandler);
expressServer.use(notFoundHandler);
expressServer.use(genericErrorHandler);

export { httpServer, expressServer };

// const expressServer = express();
// const port = process.env.PORT;

// const httpServer = createServer(expressServer);
// const socketioServer = new Server(httpServer);

// socketioServer.on("connection", newConnectionHandler);

// mongoose.connect(process.env.MONGO_URL);

// mongoose.connection.on("connected", () => {
//   httpServer.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
//   });
// });
