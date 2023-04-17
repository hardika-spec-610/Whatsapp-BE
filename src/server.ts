import express from "express"
import { Server } from "socket.io"
import { createServer } from "http" // CORE MODULE
import cors from "cors"
import { newConnectionHandler } from "./socket/index"
import { badRequestHandler, forbiddenHandler, genericErrorHandler, notFoundHandler, unauthorizedHandler } from "./errorHandlers"

const expressServer = express()

// **************************** SOCKET.IO **************************
const httpServer = createServer(expressServer)
const socketioServer = new Server(httpServer) // this constructor expects to receive an HTTP-SERVER as parameter (NOT AN EXPRESS SERVER!!!!!)

socketioServer.on("connection", newConnectionHandler)

// *************************** MIDDLEWARES *************************
expressServer.use(cors())
expressServer.use(express.json())

// *************************** ENDPOINTS ***************************

// ************************* ERROR HANDLERS ************************
expressServer.use(badRequestHandler)
expressServer.use(unauthorizedHandler)
expressServer.use(forbiddenHandler)
expressServer.use(notFoundHandler)
expressServer.use(genericErrorHandler)

export { httpServer, expressServer }
