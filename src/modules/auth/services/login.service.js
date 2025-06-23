import { OAuth2Client } from "google-auth-library";
import * as dbServices from "../../../DB/db.service.js";
import userModel, { otpType, rolesT } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/res/error.res.js";
import { success } from "../../../utils/res/success.res.js";
import {
  compareHash,
  generateHash,
} from "../../../utils/security/hash.security.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/security/token.security.js";
import { emailEvent } from "../../../utils/events/email.events.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await dbServices.findOne({
    model: userModel,
    filter: { email, isDeleted: { $exists: false } },
    isDeleted: { $exists: false },
  });
  if (!user) {
    return next(new Error("in-valid email or password", { cause: 404 }));
  }
  if (user.isConfirmed == false) {
    return next(new Error("Please confirm your email", { cause: 404 }));
  }
  if (user.provider == "google") {
    return next(new Error("in-valid provider", { cause: 404 }));
  }
  const passwordMatch = compareHash({
    plaintText: password,
    hashValue: user.password,
  });
  if (!passwordMatch) {
    return next(new Error("in-valid email or password", { cause: 404 }));
  }

  const accessSignature =
    user.role == rolesT.admin
      ? process.env.ADMIN_ACCESS_TOKEN
      : process.env.USER_ACCESS_TOKEN;
  const refreshSignature =
    user.role == rolesT.admin
      ? process.env.ADMIN_REFRESH_TOKEN
      : process.env.USER_REFRESH_TOKEN;

  // console.log(accessSignature);

  const accessToken = await generateToken({
    payload: { id: user._id.toString(), role: user.role },
    signature: accessSignature,
    expiresIn: "1h",
  });
  const refreshToken = await generateToken({
    payload: { id: user._id.toString(), role: user.role },
    signature: refreshSignature,
    expiresIn: "7d",
  });
  return success({
    res,
    status: 200,
    data: { message: "login successfully", accessToken, refreshToken },
  });
});

export const loginWithGmail = asyncHandler(async (req, res, next) => {
  const { credential: idToken } = req.body;
  // console.log(req.body);

  let payload = undefined;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID,
    });
    payload = ticket.getPayload();
    // console.log(payload);
  }
  await verify();

  const { email } = payload;
  // console.log({ name, email, picture, email_verified });

  let user = await dbServices.findOne({
    model: userModel,
    filter: { email, isDeleted: { $exists: false } },
  });
  if (!user) {
    return next(new Error("User not Found", { cause: 404 }));
  }
  if (user.provider == "system") {
    return next(new Error("in-valid provider", { cause: 404 }));
  }
  const accessSignature =
    user.role == rolesT.admin
      ? process.env.ADMIN_ACCESS_TOKEN
      : process.env.USER_ACCESS_TOKEN;
  const refreshSignature =
    user.role == rolesT.admin
      ? process.env.ADMIN_REFRESH_TOKEN
      : process.env.USER_REFRESH_TOKEN;

  const accessToken = await generateToken({
    payload: { id: user._id.toString() },
    expiresIn: "1d",
    signature: accessSignature,
  });

  const refreshToken = await generateToken({
    payload: { id: user._id.toString() },
    expiresIn: "7d",
    signature: refreshSignature,
  });

  return success({
    res,
    status: 200,
    data: {
      message: "login successfully",

      accessToken,
      refreshToken,
    },
  });
});

export const sendForgetPasswordOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await dbServices.findOne({
    model: userModel,
    filter: { email, isDeleted: { $exists: false } },
  });
  if (!user) return next(new Error("User not Found", { cause: 404 }));
  if (user.provider == "google") {
    return next(new Error("in-valid provider", { cause: 404 }));
  }
  success({
    res,
    status: 200,
    data: { message: "Otp sent successfully" },
  });
  emailEvent.emit("sendOtp", {
    email,
    type: otpType.forgetPassword,
  });
  return;
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await dbServices.findOne({
    model: userModel,
    filter: { email, isDeleted: { $exists: false } },
  });

  // check user is exist
  if (!user) return next(new Error("User not Found", { cause: 404 }));

  // check user provider
  if (user.provider == "google") {
    return next(new Error("in-valid provider", { cause: 404 }));
  }

  const otpData = user.OTP.find((otp) => otp.type == otpType.forgetPassword);

  // check otp is type exist
  if (!otpData) return next(new Error("Invalid Otp", { cause: 404 }));

  // check otp is expired
  if (otpData.expiresIn.getTime() < Date.now())
    return next(new Error("Otp expired", { cause: 404 }));

  const otpMatch = compareHash({
    plaintText: otp,
    hashValue: otpData.code,
  });

  // check otp is valid
  if (!otpMatch) {
    return next(new Error("in-valid otp", { cause: 404 }));
  }

  // update password
  const hashNewPassword = generateHash({ plaintText: password });
  user.password = hashNewPassword;
  user.changeCredentials = Date.now();
  user.OTP = [];
  await user.save();
  return success({
    res,
    status: 200,
    data: { message: "Password reset successfully" },
  });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  // console.log(authorization);

  const [bareer, token] = authorization.split(" ") || [];
  console.log(bareer, token);

  if (!bareer || !token) {
    return next(new Error("Invalid token", { cause: 400 }));
  }

  if (bareer != "Bearer" && bareer != "System") {
    return next(new Error("Invalid token BA", { cause: 400 }));
  }

  let refreshSignature =
    bareer == "Bearer"
      ? process.env.USER_REFRESH_TOKEN
      : process.env.ADMIN_REFRESH_TOKEN;

  const decoded = await verifyToken({
    token,
    signature: refreshSignature,
  });
  const user = await dbServices.findOne({
    model: userModel,
    filter: { _id: decoded.id, isDeleted: { $exists: false } },
  });
  if (!user) return next(new Error("User not Found", { cause: 404 }));

  if (decoded.iat < user.changeCredentials.getTime() / 1000) {
    return next(new Error("Invalid token please login again", { cause: 400 }));
  }

  const accessSignature =
    bareer == "Bearer"
      ? process.env.USER_ACCESS_TOKEN
      : process.env.ADMIN_ACCESS_TOKEN;

  const accessToken = await generateToken({
    payload: { id: decoded.id, role: decoded.role },
    expiresIn: "1h",
    signature: accessSignature,
  });
  return success({ res, status: 201, data: { accessToken } });
});
