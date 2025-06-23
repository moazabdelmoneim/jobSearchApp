import { Server } from "socket.io";
import {
  notifyHrs,
  registerSocket,
  sendMessage,
} from "./services/socket.service.js";

export const runIo = async (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  return io.on("connection", async (socket) => {
    const { data } = await registerSocket(socket);

    socket.on("newApplication", async (data) => {
      const result = await notifyHrs({ socket, info: data });
      // console.log(result);
    });

    socket.on("sendMessage", async (data) => {
      const result = await sendMessage({ socket, info: data });
      console.log(result);
    });
  });
};
