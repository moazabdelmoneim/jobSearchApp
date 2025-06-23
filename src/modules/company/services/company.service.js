import * as dbServices from "../../../DB/db.service.js";
import applicationModel from "../../../DB/models/application.model.js";
import companyModel from "../../../DB/models/company.model.js";
import { rolesT } from "../../../DB/models/user.model.js";
import { getStartAndEndOfDay } from "../../../utils/helpers.js";
import { cloud } from "../../../utils/multer/cloudinary.js";
import { asyncHandler } from "../../../utils/res/error.res.js";
import { success } from "../../../utils/res/success.res.js";
import ExcelJS from "exceljs";
import fs from "node:fs";
import path from "node:path";
export const createCompany = asyncHandler(async (req, res, next) => {
  const { companyName, companyEmail } = req.body;
  const company = await dbServices.findOne({
    model: companyModel,
    filter: { $or: [{ companyName }, { companyEmail }] },
  });
  if (company) return next(new Error("company already exist"));
  const newCompany = await dbServices.create({
    model: companyModel,
    data: {
      ...req.body,
      createdBy: req.user._id,
      companyName: companyName.toLowerCase(),
    },
  });
  return success({
    res,
    data: {
      message: "company created successfully",
      newCompany,
    },
  });
});

export const updateCompanyData = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await dbServices.findOne({
    model: companyModel,
    filter: { _id: companyId, isDeleted: { $exists: false } },
  });
  if (!company) return next(new Error("company not found", { cause: 404 }));

  //   check if the user is the owner of the company
  //   console.log(company.createdBy);
  //   console.log(req.user._id);

  if (company.createdBy.toString() != req.user._id.toString())
    return next(new Error("you are not authorized", { cause: 400 }));

  let updatedData = {};
  if (Object.values(req.body).length === 0)
    return next(new Error("no data to update", { cause: 400 }));

  //   loop on req.body and put the data in updatedData object
  for (let key in req.body) {
    if (req.body[key]) {
      updatedData[key] = req.body[key];
    }
  }
  const newCompany = await dbServices.updateOne({
    model: companyModel,
    filter: { _id: companyId, isDeleted: { $exists: false } },
    data: updatedData,
  });
  return success({
    res,
    data: {
      message: "company updated successfully",
    },
  });
});

export const softDeleteCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await dbServices.findOne({
    model: companyModel,
    filter: {
      _id: companyId,
      isDeleted: { $exists: false },
    },
  });
  if (!company) return next(new Error("company not found", { cause: 404 }));

  if (
    company.createdBy.toString() != req.user._id.toString() &&
    req.user.role !== rolesT.admin
  ) {
    return next(new Error("you are not authorized", { cause: 400 }));
  }
  await dbServices.updateOne({
    model: companyModel,
    filter: { _id: companyId },
    data: { isDeleted: Date.now() },
  });
  return success({
    res,
    data: {
      message: "company deleted successfully",
    },
  });
});

export const getCompanyRelatedJob = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await dbServices.findOne({
    model: companyModel,
    filter: {
      _id: companyId,
      isDeleted: { $exists: false },
    },
  });
  if (!company) return next(new Error("company not found", { cause: 404 }));

  return success({
    res,
    data: {
      message: "company jobs",
      jobs: company.jobs,
    },
  });
});

export const getCompanyByName = asyncHandler(async (req, res, next) => {
  const { name } = req.params;
  const company = await dbServices.findOne({
    model: companyModel,
    filter: {
      companyName: name.toLowerCase(),
      isDeleted: { $exists: false },
    },
  });
  if (!company) return next(new Error("company not found", { cause: 404 }));
  return success({
    res,
    data: {
      message: "company",
      company,
    },
  });
});

export const uploadCompanyLogo = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const file = req?.file;

  if (!file) return next(new Error("no file uploaded", { cause: 400 }));
  //   console.log(file);
  const company = await dbServices.findOne({
    model: companyModel,
    filter: {
      _id: companyId,
      createdBy: req.user._id,
      isDeleted: { $exists: false },
    },
  });

  if (!company) return next(new Error("company not found", { cause: 404 }));

  const { secure_url, public_id } = await (
    await cloud()
  ).uploader.upload(file.path, { folder: `companies/logo/${companyId}` });
  if (!secure_url)
    return next(
      new Error("something went wrong with uploading the pic", { cause: 400 })
    );
  company.logo = { secure_url, public_id };
  await company.save();
  return success({
    res,
    data: {
      message: "company logo uploaded successfully",
    },
  });
});

export const uploadCompanyCover = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const file = req?.file;

  if (!file) return next(new Error("no file uploaded", { cause: 400 }));
  //   console.log(file);
  const company = await dbServices.findOne({
    model: companyModel,
    filter: {
      _id: companyId,
      createdBy: req.user._id,
      isDeleted: { $exists: false },
    },
  });

  if (!company) return next(new Error("company not found", { cause: 404 }));

  const { secure_url, public_id } = await (
    await cloud()
  ).uploader.upload(file.path, { folder: `users/coverPic/${companyId}` });
  if (!secure_url)
    return next(
      new Error("something went wrong with uploading the pic", { cause: 400 })
    );
  company.coverPic = { secure_url, public_id };
  await company.save();
  return success({
    res,
    data: {
      message: "company Cover uploaded successfully",
    },
  });
});

export const deleteCompanyLogo = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await dbServices.findOne({
    model: companyModel,
    filter: {
      _id: companyId,
      createdBy: req.user._id,
      isDeleted: { $exists: false },
    },
  });
  company.logo = null;
  await company.save();
  return success({
    res,
    data: {
      message: "company logo deleted successfully",
    },
  });
});
export const deleteCompanyCover = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await dbServices.findOne({
    model: companyModel,
    filter: {
      _id: companyId,
      createdBy: req.user._id,
      isDeleted: { $exists: false },
    },
  });
  company.coverPic = null;
  await company.save();
  return success({
    res,
    data: {
      message: "company logo deleted successfully",
    },
  });
});

export const getAllApplicationWithExcel = asyncHandler(
  async (req, res, next) => {
    const { date } = req.query;
    const { startOfDay, endOfDay } = getStartAndEndOfDay(date);
    const { companyId } = req.params;

    const company = await dbServices.findOne({
      model: companyModel,
      filter: {
        _id: companyId,
        isDeleted: { $exists: false },
      },
      populate: {
        path: "jobs",
        populate: {
          path: "applications",
          match: {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
      },
    });
    if (!company) return next(new Error("company not found", { cause: 404 }));
    if (!company.HRs.includes(req.user._id)) {
      return next(new Error("you are not authorized", { cause: 400 }));
    }

    let applications = company.jobs.map(
      (job) => job.applications.length != 0 && [...job.applications]
    );

    applications = applications.flat().filter((app) => app !== false);
    if (!applications || applications.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "No applications found for the specified company and date",
      });
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applications");
    worksheet.columns = [
      { header: "Application ID", key: "id", width: 20 },
      { header: "Job ID", key: "jobId", width: 20 },
      { header: "User ID", key: "userId", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 },
      { header: "Updated At", key: "updatedAt", width: 25 },
      { header: "CV URL", key: "cvUrl", width: 50 },
    ];
    applications.forEach((app) => {
      worksheet.addRow({
        id: app._id,
        jobId: app.jobId,
        userId: app.userId,
        status: app.status,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        cvUrl: app.userCv.secure_url,
      });
    });
    const directoryPath = "./sheets";
    const filePath = path.join(directoryPath, "applications.xlsx");
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
      console.log(`Directory created: ${directoryPath}`);
    }
    workbook.xlsx.writeFile(filePath);

    return success({
      res,
      data: {
        message: "applications",
        applications,
      },
    });
  }
);
