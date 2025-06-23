import express from "express";
import * as dotenv from "dotenv";
import path from "node:path";
import { bootStrap } from "./src/app.controller.js";
import { runIo } from "./src/modules/socket/chat.controller.js";

dotenv.config({ path: path.resolve("./src/config/.dev.env") }); 
const app = express();
const port = process.env.PORT || 3000;

bootStrap(app, express);

const httpServer = app.listen(port, () =>
  console.log(`app listening on port ${port}!`)
);
runIo(httpServer);
