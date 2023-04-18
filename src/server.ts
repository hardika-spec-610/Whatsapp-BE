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
import userRouter from "./api/users/index";

const expressServer = express();

// **************************** SOCKET.IO **************************
const httpServer = createServer(expressServer);
const socketioServer = new Server(httpServer); // this constructor expects to receive an HTTP-SERVER as parameter (NOT AN EXPRESS SERVER!!!!!)

socketioServer.on("connection", newConnectionHandler);

// *************************** MIDDLEWARES *************************
expressServer.use(cors());
expressServer.use(express.json());

// *************************** ENDPOINTS ***************************
expressServer.use("/user", userRouter);

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
