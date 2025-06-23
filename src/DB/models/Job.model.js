import { Schema, Types, model } from "mongoose";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      required: true,
      enum: ["onsite", "remote", "hybrid"],
    },
    jobDescription: {
      type: String,
      required: true,
    },
    workingTime: {
      type: String,
      required: true,
      enum: ["full-time", "part-time"],
    },
    seniorityLevel: {
      type: String,
      required: true,
      enum: ["fresh", "Junior", "Mid-Level", "Senior", "Team Lead", "CTO"],
    },
    technicalSkills: [
      {
        type: String,
        required: true,
      },
    ],
    softSkills: [
      {
        type: String,
        required: true,
      },
    ],
    addedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
jobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
});
const jobModel = model.Job || model("Job", jobSchema);
export default jobModel;
