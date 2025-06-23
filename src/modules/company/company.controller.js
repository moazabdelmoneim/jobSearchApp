import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./company.validation.js";
import * as companyServices from "./services/company.service.js";
import { authentication } from "../../middleware/auth.middleware.js";
import {
  fileValidationTypes,
  uploadCloudfile,
} from "../../utils/multer/cloud.multer.js";
import { jobRouter } from "../job/job.controller.js";

export const companyRouter = Router({ mergeParams: true });
companyRouter.use("/:companyId/job", jobRouter);

companyRouter.post(
  "/createCompany",
  validation(validators.createCompany),
  authentication(),
  companyServices.createCompany
);
companyRouter.patch(
  "/updateCompanyData/:companyId",
  validation(validators.updateCompany),
  authentication(),
  companyServices.updateCompanyData
);
companyRouter.delete(
  "/deleteCompany/:companyId",
  validation(validators.softDeleteCompany),
  authentication(),
  companyServices.softDeleteCompany
);
companyRouter.get(
  "/getCompanyRelatedJob/:companyId",
  validation(validators.CompanyId),
  authentication(),
  companyServices.getCompanyRelatedJob
);
companyRouter.get(
  "/getcompanyByName/:name",
  validation(validators.getcompanyByName),
  authentication(),
  companyServices.getCompanyByName
);

companyRouter.post(
  "/uploadCompanyLogo/:companyId",
  validation(validators.CompanyId),
  uploadCloudfile(fileValidationTypes.image).single("companyLogo"),
  authentication(),
  companyServices.uploadCompanyLogo
);
companyRouter.post(
  "/uploadCompanyCover/:companyId",
  validation(validators.CompanyId),
  uploadCloudfile(fileValidationTypes.image).single("companyCover"),
  authentication(),
  companyServices.uploadCompanyCover
);
companyRouter.delete(
  "/companyCover/:companyId",
  validation(validators.CompanyId),
  authentication(),
  companyServices.deleteCompanyCover
);
companyRouter.delete(
  "/companyLogo/:companyId",
  validation(validators.CompanyId),
  authentication(),
  companyServices.deleteCompanyLogo
);


companyRouter.get(
  "/getAllApplicationWithExcel/:companyId",
  validation(validators.getAllApplicationWithExcel),
  authentication(),
  companyServices.getAllApplicationWithExcel
);