import * as dbServices from "../../../DB/db.service.js";
import chatModel from "../../../DB/models/chat.model.js";
import companyModel from "../../../DB/models/company.model.js";
import jobModel from "../../../DB/models/Job.model.js";
import userModel, { socketConnections } from "../../../DB/models/user.model.js";
import { authenticationSocket } from "../authSocket.js";

export const registerSocket = async (socket) => {
  const { data } = await authenticationSocket({
    socket,
  });
  // console.log(data);

  if (!data.valid) {
    return {
      data: {
        statusCode: 400,
        message: "User not found",
      },
    };
  }
  socketConnections.set(data?.user?._id?.toString(), socket.id);
  console.log(socketConnections);
  return "Done";
};

export const notifyHrs = async ({ socket, info }) => {
  const { companyId, jobId } = info;

  const { data } = await authenticationSocket({
    socket,
  });
  //   console.log(data);
  if (data.message) return data;
  const { user, valid } = data;
  if (!valid) {
    return {
      statusCode: 400,
      message: "User not found",
    };
  }

  // console.log(data);
  const company = await dbServices.findOne({
    model: companyModel,
    filter: { _id: companyId },
  });
  //   console.log(company);

  if (!company) {
    // console.log("company not found");
    return {
      statusCode: 404,
      message: "Company not found",
    };
  }

  const job = await dbServices.findOne({
    model: jobModel,
    filter: { _id: jobId },
  });
  const messageS = `new application has been submitted for ${job?.jobTitle}`;

  const filteredSocketId = company.HRs.map((id) => {
    if (socketConnections.has(id.toString())) return id.toString();
  });

  socket.to(filteredSocketId).emit("newApplication", { message: messageS });
  return { message: "Done" };
};

export const sendMessage = async ({ socket, info }) => {
  const { companyId, receiverId, message } = info;
  const { data } = await authenticationSocket({
    socket,
  });
  //   console.log(data);
  if (data.message) return data;
  const { user, valid } = data;
  if (!valid) {
    return {
      statusCode: 400,
      message: "User not found",
    };
  }
  const company = await dbServices.findOne({
    model: companyModel,
    filter: { _id: companyId },
  });
  if (!company) {
    return {
      statusCode: 404,
      message: "Company not found",
    };
  }
  const chat = await dbServices.findOne({
    model: chatModel,
    filter: {
      $or: [
        { senderId: user._id, receiverId },
        { senderId: receiverId, receiverId: user._id },
      ],
    },
  });

  if (!chat) {
    if (!company.HRs.includes(user._id.toString())) {
      return {
        statusCode: 404,
        message: "You are not HR in this company",
      };
    }
    const newChat = await dbServices.create({
      model: chatModel,
      data: {
        senderId: user._id,
        receiverId,
        $push: {
          message: { senderId: user._id, message },
        },
      },
    });
    newChat.message.push({ senderId: user._id, message });
    await newChat.save();
    return {
      statusCode: 200,
      message: "Chat created",
      data: newChat,
    };
  }

  chat.message.push({ senderId: user._id, message });
  await chat.save();
  const candidate = await dbServices.findOne({
    model: userModel,
    filter: { _id: receiverId },
  });

  if (!candidate) {
    return {
      statusCode: 404,
      message: "Candidate not found",
    };
  }
  return {
    statusCode: 200,
    message: "Chat updated",
    data: chat,
  };
};
