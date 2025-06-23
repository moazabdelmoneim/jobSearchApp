import * as dbServices from "../../../DB/db.service.js";
import applicationModel from "../../../DB/models/application.model.js";
import companyModel from "../../../DB/models/company.model.js";
import jobModel from "../../../DB/models/Job.model.js";
import { emailEvent } from "../../../utils/events/email.events.js";
import { cloud } from "../../../utils/multer/cloudinary.js";
import { asyncHandler } from "../../../utils/res/error.res.js";
import { success } from "../../../utils/res/success.res.js";

export const createApplication = asyncHandler(async (req, res, next) => {
  const { jobId, companyId } = req.params;
  const job = await dbServices.findOne({
    model: jobModel,
    filter: { _id: jobId, closed: false },
  });
  if (!job) {
    return next(new Error("job not found", { cause: 404 }));
  }
  const company = await dbServices.findOne({
    model: companyModel,
    filter: { _id: companyId },
  });
  if (!company) {
    return next(new Error("company not found", { cause: 404 }));
  }
  const file = req?.file;
  let userCv = {};
  if (file) {
    const { secure_url, public_id } = await (
      await cloud()
    ).uploader.upload(file.path, { folder: `users/coverPic/${req.user._id}` });
    if (!secure_url)
      return next(
        new Error("something went wrong with uploading the pic", { cause: 400 })
      );
    userCv = {
      secure_url,
      public_id,
    };
  }
  const application = await dbServices.create({
    model: applicationModel,
    data: {
      jobId,
      companyId,
      userId: req.user._id,
      userCv,
    },
  });

  return success({
    res,
    statusCode: 201,
    data: { message: "application created successfully", application },
  });
});

export const updateApplication = asyncHandler(async (req, res, next) => {
  const { applicationId, jobId, companyId } = req.params;
  const user = req.user;

  // check if the company
  const company = await dbServices.findOne({
    model: companyModel,
    filter: { _id: companyId },
  });

  if (!(company.HRs || [])?.includes(user._id)) {
    return next(new Error("You are not authorized", { cause: 404 }));
  }

  const job = await dbServices.findOne({
    model: jobModel,
    filter: { _id: jobId },
  });
  if (!job) {
    return next(new Error("job not found", { cause: 404 }));
  }

  const application = await dbServices.findOne({
    model: applicationModel,
    filter: { _id: applicationId },
  });

  if (!application) {
    return next(new Error("application not found", { cause: 404 }));
  }

  if (!["viewd", "pending", "in consideration"].includes(application.status)) {
    return next(
      new Error("application is already accepted or rejected", { cause: 400 })
    );
  }
  const { status } = req.body;

  const updatedApplication = await dbServices.updateOne({
    model: applicationModel,
    filter: { _id: applicationId },
    data: { status },
  });
  success({
    res,
    statusCode: 200,
    data: { message: "application updated successfully", updatedApplication },
  });
  if (status == "accepted" || status == "rejected") {
    emailEvent.emit("sendEmail", {
      jobTitle: job.jobTitle,
      userId: application.userId,
      companyName: company.companyName,
      status,
    });
  }
  return;
});
//
//
//
//
