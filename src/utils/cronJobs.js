import cron from "node-cron";
import * as dbServices from "../DB/db.service.js";
import userModel from "../DB/models/user.model.js";

const deleteExpiredOTPs = async () => {
  // console.log('hi');

  try {
    const now = new Date();
    // const usersWithExpiredOTPs = await userModel.find({
    //   "OTP.expiresIn": { $lt: now },
    // });
    // console.log("Users with expired OTPs:", usersWithExpiredOTPs);
    const result = await dbServices.findAll({
      model: userModel,
      filter: { "OTP.expiresIn": { $lt: now } },
    });
    for (let user of result) {
      user.OTP = user.OTP.filter((otp) => otp.expiresIn > now) || [];
      await user.save();
    }
    // console.log(result);
  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
  }
};

// Schedule the CRON job to run every 6 hours
const startCronJob = () => {
  //   console.log("hi");

  cron.schedule("* */6 * * *", deleteExpiredOTPs);
  //   console.log("CRON job scheduled to run every 6 hours.");
};

export default startCronJob;
