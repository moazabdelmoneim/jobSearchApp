import { model, Schema,Types } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    userCv: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "acceppted", "rejected", "viewd", "in consideration"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
applicationSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
  options: { select: "firstname lastname email gender" },
});

const applicationModel =
  model.Application || model("Application", applicationSchema);

export default applicationModel;
