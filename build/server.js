"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressServer = exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http"); // CORE MODULE
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./socket/index");
const errorHandlers_1 = require("./errorHandlers");
const passport_1 = __importDefault(require("passport"));
const googleOauth_js_1 = __importDefault(require("./lib/auth/googleOauth.js"));
const expressServer = (0, express_1.default)();
exports.expressServer = expressServer;
passport_1.default.use("google", googleOauth_js_1.default);
// **************************** SOCKET.IO **************************
const httpServer = (0, http_1.createServer)(expressServer);
exports.httpServer = httpServer;
const socketioServer = new socket_io_1.Server(httpServer); // this constructor expects to receive an HTTP-SERVER as parameter (NOT AN EXPRESS SERVER!!!!!)
socketioServer.on("connection", index_1.newConnectionHandler);
// *************************** MIDDLEWARES *************************
expressServer.use((0, cors_1.default)());
expressServer.use(express_1.default.json());
expressServer.use(passport_1.default.initialize());
// *************************** ENDPOINTS ***************************
// ************************* ERROR HANDLERS ************************
expressServer.use(errorHandlers_1.badRequestHandler);
expressServer.use(errorHandlers_1.unauthorizedHandler);
expressServer.use(errorHandlers_1.forbiddenHandler);
expressServer.use(errorHandlers_1.notFoundHandler);
expressServer.use(errorHandlers_1.genericErrorHandler);
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
