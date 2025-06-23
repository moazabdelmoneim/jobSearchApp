import { Schema, Types, model } from "mongoose";
export const otpType = {
  confirmEmail: "confirmEmail",
  forgetPassword: "forgetPassword",
};
export const rolesT = {
  admin: "admin",
  user: "user",
};

export const socketConnections = new Map();
const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    provider: {
      type: String,
      required: true,
      enum: ["system", "google"],
      default: "system",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    DOB: {
      type: Date,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    mobileNumber: {
      type: String,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isDeleted: Date,
    bannedAt: Date,
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    changeCredentials: Date,
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    OTP: [
      {
        code: String,
        expiresIn: Date,
        type: {
          type: String,
          enum: ["confirmEmail", "forgetPassword"],
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("username").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

const userModel = model.User || model("User", userSchema);
export default userModel;
