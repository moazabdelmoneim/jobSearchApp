import { model, Schema, Types } from "mongoose";

const chatSchema = new Schema({
  senderId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: [
    {
      senderId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
});

const chatModel = model.Chat || model("Chat", chatSchema);
export default chatModel;
