import * as dbServices from "../../../DB/db.service.js";
import applicationModel from "../../../DB/models/application.model.js";
import companyModel from "../../../DB/models/company.model.js";
import jobModel from "../../../DB/models/Job.model.js";
import { cloud } from "../../../utils/multer/cloudinary.js";
import { pagination } from "../../../utils/pagination.js";
import { asyncHandler } from "../../../utils/res/error.res.js";
import { success } from "../../../utils/res/success.res.js";

export const createJob = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  //   console.log(companyId);

  const company = await dbServices.findOne({
    model: companyModel,
    _id: companyId,
  });
  if (!company) {
    return next(new Error("company not found"));
  }
  console.log(company.createdBy.toString() == req.user._id.toString());

  if (
    !company.HRs?.includes(req.user._id) &&
    company.createdBy.toString() !== req.user._id.toString()
  ) {
    return next(
      new Error("You are not authorized to create a job for this company", {
        cause: 403, // Forbidden status code
      })
    );
  }
  const job = await dbServices.create({
    model: jobModel,
    data: { ...req.body, addedBy: req.user._id, companyId },
  });
  return success({
    res,
    statusCode: 201,
    data: { message: "job created successfully", job },
  });
});

export const updateJob = asyncHandler(async (req, res, next) => {
  const { companyId, jobId } = req.params;
  //   console.log(companyId);
  if (Object.keys(req.body).length === 0) {
    return next(
      new Error("You must provide at least one field to update", { cause: 400 })
    );
  }
  const job = await dbServices.findOne({
    model: jobModel,
    _id: jobId,
  });
  if (!job) {
    return next(new Error("job not found"));
  }
  const company = await dbServices.findOne({
    model: companyModel,
    _id: companyId,
  });
  if (!company) {
    return next(new Error("company not found"));
  }
  if (company.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not authorized to update the job for this company", {
        cause: 403,
      })
    );
  }
  const updatedJob = await dbServices.updateOne({
    model: jobModel,
    _id: req.params.jobId,
    data: req.body,
  });
  return success({
    res,
    statusCode: 201,
    data: { message: "job updated successfully", job },
  });
});

export const deleteJob = asyncHandler(async (req, res, next) => {
  const { companyId, jobId } = req.params;
  //   console.log(companyId);
  if (Object.keys(req.body).length === 0) {
    return next(
      new Error("You must provide at least one field to update", { cause: 400 })
    );
  }
  const job = await dbServices.findOne({
    model: jobModel,
    filter: { _id: jobId },
  });
  if (!job) {
    return next(new Error("job not found"));
  }

  const company = await dbServices.findOne({
    model: companyModel,
    _id: companyId,
  });
  if (!company) {
    return next(new Error("company not found"));
  }
  if (
    !company.HRs.includes(req.user._id) &&
    company.createdBy.toString() !== req.user._id.toString()
  ) {
    return next(
      new Error("You are not authorized to delete the job for this company", {
        cause: 403,
      })
    );
  }
  const updatedJob = await dbServices.deleteOne({
    model: jobModel,
    filter: { _id: jobId },
  });

  return success({
    res,
    statusCode: 201,
    data: { message: "job deleted successfully" },
  });
});

export const getAllJobs = asyncHandler(async (req, res, next) => {
  const { jobId, companyId, companyName, page, size, sort } = req.query;

  let data = undefined;
  if (jobId) {
    const job = await dbServices.findOne({
      model: jobModel,
      filter: { _id: jobId },
    });
    if (!job) {
      return next(new Error("job not found", { cause: 404 }));
    }
    return success({
      res,
      statusCode: 200,
      data: { message: "job retrieved successfully", job },
    });
  }

  if (companyId) {
    data = await pagination({
      model: jobModel,
      filter: { companyId },
      sort,
      size,
      page,
    });
  }

  if (companyName) {
    const company = await dbServices.findOne({
      model: companyModel,
      filter: { companyName },
    });
    if (!company) {
      return next(new Error("company not found", { cause: 404 }));
    }
    data = await pagination({
      model: jobModel,
      filter: { companyId: company._id },
      sort,
      size,
      page,
    });
  }
  if (data.result.length === 0) {
    return next(new Error("No jobs found", { cause: 404 }));
  }
  const { count, result: jobs } = data;
  return success({
    res,
    statusCode: 200,
    data: { message: "job retrieved successfully", page, size, count, jobs },
  });
});

export const getFilteredJobs = asyncHandler(async (req, res, next) => {
  const {
    page,
    size,
    sort,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;

  const data = await pagination({
    model: jobModel,
    filter: { jobLocation, seniorityLevel, jobTitle, technicalSkills },
    sort,
    size,
    page,
  });
  if (data.result.length === 0) {
    return next(new Error("No jobs found", { cause: 404 }));
  }
  const { count, result: jobs } = data;
  return success({
    res,
    statusCode: 200,
    data: { message: "job retrieved successfully", page, size, count, jobs },
  });
});

export const getAllAplicationsForJob = asyncHandler(async (req, res, next) => {
  const { jobId, companyId, page, size, sort } = req.params;
  const company = await dbServices.findOne({
    model: companyModel,
    filter: { _id: companyId },
  });
  if (!company) {
    return next(new Error("company not found", { cause: 404 }));
  }
  if (
    !company.HRs.includes(req.user._id) &&
    company.createdBy.toString() !== req.user._id.toString()
  ) {
    return next(
      new Error("You are not authorized to get the applications for this job", {
        cause: 403,
      })
    );
  }
  const data = await pagination({
    model: applicationModel,
    filter: { jobId },
    page,
    size,
    sort,
  });
  const { count, result: applications } = data;
  return success({
    res,
    statusCode: 200,
    data: {
      message: "applications retrieved successfully",
      applications,
      count,
      page,
      size,
    },
  });
});

// ///////////////////////////////////////////////////
