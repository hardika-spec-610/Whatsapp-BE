import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import { httpServer, expressServer } from "./server"

const port = process.env.PORT || 3001

mongoose.connect(process.env.MONGO_URL as string)

mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    // DO NOT FORGET TO LISTEN WITH HTTP SERVER HERE, NOT EXPRESS SERVER!
    console.table(listEndpoints(expressServer))
    console.log(`Server listening on port ${port}`)
  })
})
