import * as dbServices from "../../../DB/db.service.js";
import userModel from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/res/error.res.js";
import { success } from "../../../utils/res/success.res.js";
import CryptoJS from "crypto-js";
import {
  compareHash,
  generateHash,
} from "../../../utils/security/hash.security.js";
import { cloud } from "../../../utils/multer/cloudinary.js";

export const updateUser = asyncHandler(async (req, res, next) => {
  const { mobileNumber, DOB, firstName, lastName, gender } = req.body;
  let updatedData = {};

  // check  if there is any data to update
  if (Object.values(req.body).length === 0)
    return next(new Error("no data to update", { cause: 400 }));

  //   loop on req.body and put the data in updatedData object
  for (let key in req.body) {
    if (req.body[key]) {
      updatedData[key] = req.body[key];
    }
  }

  //   encrypt mobile number
  if (updatedData.mobileNumber)
    updatedData.mobileNumber = CryptoJS.AES.encrypt(
      mobileNumber,
      "privatePhoneNumberthunder"
    ).toString();
  //   console.log(updatedData);

  const user = await dbServices.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: req.user._id,
      isDeleted: { $exists: false },
      isConfirmed: true,
    },
    data: updatedData,
    options: { new: true },
  });
  //   console.log(user);

  return success({
    res,
    data: {
      message: " user updated successfully",
      user: { firstName, lastName, gender },
    },
  });
});

export const getUserData = asyncHandler(async (req, res, next) => {
  const user = await dbServices.findOne({
    model: userModel,
    filter: {
      _id: req.user._id,
      isDeleted: { $exists: false },
      isConfirmed: true,
    },
    select: "username gender mobileNumber DOB email",
  });

  const decryptedMobileNumber = CryptoJS.AES.decrypt(
    user.mobileNumber,
    "privatePhoneNumberthunder"
  ).toString(CryptoJS.enc.Utf8);
  user.mobileNumber = decryptedMobileNumber;
  return success({
    res,
    data: {
      message: " user updated successfully",
      user,
    },
  });
});

export const getUserById = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (userId === req.user._id)
    next(new Error("you can't get your data", { cause: 400 }));

  const user = await dbServices.findOne({
    model: userModel,
    filter: {
      _id: req.params.userId,
      isDeleted: { $exists: false },
      isConfirmed: true,
    },
    select: "username profilePic mobileNumber coverPic",
  });
  if (!user) return next(new Error("user not found", { cause: 404 }));

  const decryptedMobileNumber = CryptoJS.AES.decrypt(
    user.mobileNumber,
    "privatePhoneNumberthunder"
  ).toString(CryptoJS.enc.Utf8);
  user.mobileNumber = decryptedMobileNumber;
  return success({
    res,
    data: {
      message: " user updated successfully",
      user,
    },
  });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  const isMatch = compareHash({
    plaintText: oldPassword,
    hashValue: user.password,
  });
  if (!isMatch) return next(new Error("wrong password", { cause: 400 }));

  const hashPassword = generateHash({ plaintText: newPassword });
  user.password = hashPassword;
  user.changeCredentials = Date.now();
  await user.save();
  return success({
    res,
    data: {
      message: "password updated successfully",
    },
  });
});

export const uploadProfilePic = asyncHandler(async (req, res, next) => {
  const file = req?.file;

  if (!file) return next(new Error("no file uploaded", { cause: 400 }));
  //   console.log(file);

  const { secure_url, public_id } = await (
    await cloud()
  ).uploader.upload(file.path, { folder: `users/profilePic/${req.user._id}` });
  if (!secure_url)
    return next(
      new Error("something went wrong with uploading the pic", { cause: 400 })
    );

  const user = await dbServices.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: req.user._id,
      isDeleted: { $exists: false },
      isConfirmed: true,
    },
    data: { profilePic: { secure_url, public_id } },
    options: { new: true },
  });

  return success({
    res,
    data: {
      message: "profile pic uploaded successfully",
      profilePic: { secure_url, public_id },
    },
  });
});

export const uploadCoverPic = asyncHandler(async (req, res, next) => {
  const file = req?.file;

  if (!file) return next(new Error("no file uploaded", { cause: 400 }));
  //   console.log(file);

  const { secure_url, public_id } = await (
    await cloud()
  ).uploader.upload(file.path, { folder: `users/coverPic/${req.user._id}` });
  if (!secure_url)
    return next(
      new Error("something went wrong with uploading the pic", { cause: 400 })
    );

  const user = await dbServices.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: req.user._id,
      isDeleted: { $exists: false },
      isConfirmed: true,
    },
    data: { coverPic: { secure_url, public_id } },
    options: { new: true },
  });

  return success({
    res,
    data: {
      message: "cover pic uploaded successfully",
      profilePic: { secure_url, public_id },
    },
  });
});

export const deleteProfilePic = asyncHandler(async (req, res, next) => {
  const user = req.user;

  user.profilePic = { secure_url: "", public_id: "" };
  await user.save();
  return success({
    res,
    data: {
      message: "profile pic deleted successfully",
    },
  });
});
export const deleteCoverPic = asyncHandler(async (req, res, next) => {
  const user = req.user;

  user.coverPic = { secure_url: "", public_id: "" };
  await user.save();
  return success({
    res,
    data: {
      message: "cover pic deleted successfully",
    },
  });
});

export const softDeleteAccount = asyncHandler(async (req, res, next) => {
  const user = req.user;
  user.isDeleted = Date.now();
  user.changeCredentials = Date.now();
  await user.save();
  return success({
    res,
    data: {
      message: "account deleted successfully",
    },
  });
});
