import { Schema, Types, model } from "mongoose";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    numberOfEmployees: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^\d+-\d+$/.test(value);
        },
        message: "must be range such as 11-20 employee.",
      },
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    logo: {
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    coverPic: {
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    HRs: [{ type: Types.ObjectId, ref: "User" }],
    isDeleted: Date,
    bannedAt: Date,
    legalAttachment: {
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
companySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
});
const companyModel = model.Company || model("Company", companySchema);
export default companyModel;
