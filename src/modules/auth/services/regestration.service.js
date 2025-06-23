import * as dbServices from "../../../DB/db.service.js";
import userModel, { otpType } from "../../../DB/models/user.model.js";
import { emailEvent } from "../../../utils/events/email.events.js";
import { asyncHandler } from "../../../utils/res/error.res.js";
import { success } from "../../../utils/res/success.res.js";
import CryptoJS from "crypto-js";
import {
  compareHash,
  generateHash,
} from "../../../utils/security/hash.security.js";
import { OAuth2Client } from "google-auth-library";

export const signup = asyncHandler(async (req, res, next) => {
  const { email, mobileNumber } = req.body;
  const user = await dbServices.findOne({
    model: userModel,
    filter: { email },
  });

  if (user) {
    return next(new Error("email already exist", { cause: 409 }));
  }
  const encryptedMobileNumber = CryptoJS.AES.encrypt(
    mobileNumber,
    "privatePhoneNumberthunder"
  ).toString();

  const hashedPassword = generateHash({ plaintText: req.body.password });
  // console.log(req.body);
  const newUser = await dbServices.create({
    model: userModel,
    data: {
      ...req.body,
      password: hashedPassword,
      mobileNumber: encryptedMobileNumber,
    },
  });
  // console.log(newUser);

  success({
    res,
    status: 201,
    data: { message: "user created successfully" },
  });
  emailEvent.emit("sendOtp", { email, type: otpType.confirmEmail });
  return;
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await dbServices.findOne({
    model: userModel,
    filter: { email },
  });
  if (!user) return next(new Error("user not found", { cause: 404 }));

  //check if the user is already confirmed
  if (user.isConfirmed)
    return next(new Error("user already confirmed", { cause: 409 }));
  const verifyOtp = compareHash({
    plaintText: otp,
    hashValue: user.OTP[0]?.code,
  });

  //check if the otp is expired
  if (user.OTP[0].expiresIn < Date.now())
    return next(new Error("otp expired", { cause: 400 }));

  // check if the otp is valid
  if (!verifyOtp) return next(new Error("invalid otp", { cause: 400 }));

  //update the user
  await dbServices.updateOne({
    model: userModel,
    filter: { email },
    data: { isConfirmed: true, $unset: { OTP: 1 } },
  });

  success({
    res,
    status: 200,
    data: { message: "email confirmed successfully" },
  });
});

export const signupWithGmail = asyncHandler(async (req, res, next) => {
  const { credential: idToken } = req.body;

  let payload = undefined;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID,
    });
    payload = ticket.getPayload();
  }
  await verify();
  const { name, email, picture, email_verified } = payload;
  if (!email_verified)
    return next(new Error("invalid account", { cause: 400 }));

  let user = await dbServices.findOne({
    model: userModel,
    filter: { email: payload.email },
  });
  if (user) {
    return next(new Error("email already exist", { cause: 409 }));
  }
  // console.log(name.split(" "));

  await dbServices.create({
    model: userModel,
    data: {
      email: email,
      firstname: name.split(" ")[0],
      lastname: name.split(" ")[1],
      provider: "google",
      profilePic: { secure_url: picture },
      isConfirmed: email_verified,
    },
    options: {
      validateBeforeSave: false,
    },
  });

  return success({
    res,
    statusCode: 201,
    data: { message: "account created successfully" },
  });
});
