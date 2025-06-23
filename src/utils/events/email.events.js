import { customAlphabet } from "nanoid";
import { EventEmitter } from "node:events";
import { generateHash } from "../security/hash.security.js";
import userModel from "../../DB/models/user.model.js";
import { sendEmail } from "../email/send.email.js";
import {
  notifiactionTemp,
  verifyAccountTempl,
} from "../email/template/verifyAccount.temp.js";
import * as dbServices from "../../DB/db.service.js";

const sendMailOtp = async ({ emailData }) => {
  const { email, type } = emailData;
  const otp = customAlphabet("1234567890", 4)();
  const hashOtp = generateHash({ plaintText: otp });
  const user = await dbServices.findOne({
    model: userModel,
    filter: { email, isDeleted: { $exists: false } },
  });
  // let dataUpdate = "";

  // switch (subject) {
  //   case "confirmEmail":
  //     dataUpdate = { confirmEmailOtp: hashOtp };
  //     break;
  //   case "forgetPassword":
  //     dataUpdate = { forgetPasswordOtp: hashOtp };
  //     break;
  //   case "twoStepVerification":
  //     dataUpdate = { twoStepVerificationOtp: hashOtp };
  //     break;
  //   default:
  //     break;
  // }

  const otpData = user.OTP.find((otp) => otp.type == type);
  if (otpData) {
    otpData.code = hashOtp;
    otpData.expiresIn = new Date(Date.now() + 10 * 60 * 1000);
  } else {
    user.OTP.push({
      code: hashOtp,
      expiresIn: new Date(Date.now() + 10 * 60 * 1000),
      type,
    });
  }
  // await dbServices.updateOne({
  //   model: userModel,
  //   filter: { email },
  //   data: {
  //     $push: {
  //       OTP: {
  //         code: hashOtp,
  //         expiresIn: new Date(Date.now() + 10 * 60 * 1000),
  //         type,
  //       },
  //     },
  //   },
  // });
  await user.save();
  const html = verifyAccountTempl(otp);
  await sendEmail({
    to: email,
    html,
  });
};

export const emailEvent = new EventEmitter();

emailEvent.on("sendOtp", async (emailData) => {
  // const {email,type} = emailData;

  sendMailOtp({ emailData });
});

const sendEmailNotification = async ({ emailData }) => {
  const { jobTitle, userId, companyName, status } = emailData;

  const user = await dbServices.findOne({
    model: userModel,
    filter: { _id: userId, isDeleted: { $exists: false } },
  });
  const email = user.email;
  const html = notifiactionTemp({
    companyName,
    status,
    jobTitle,
    name: user.username,
  });
  await sendEmail({
    to: email,

    html,
  });
};

emailEvent.on("sendEmail", async (data) => {
  sendEmailNotification({ emailData: data });
  // console.log(data)
});
