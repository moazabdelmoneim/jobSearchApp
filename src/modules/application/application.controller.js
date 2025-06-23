import { Router } from "express";
import {
  fileValidationTypes,
  uploadCloudfile,
} from "../../utils/multer/cloud.multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import * as validators from "./application.validation.js";
import * as applicationServices from "./services/application.service.js";
import { rolesT } from "../../DB/models/user.model.js";
export const applicationRouter = Router({ mergeParams: true });

applicationRouter.post(
  "/applyForJob",
  validation(validators.createApplication),
  authentication(),
  authorization(rolesT.user),
  uploadCloudfile(fileValidationTypes.pdf).single("userCv"),
  applicationServices.createApplication
);

applicationRouter.patch(
  "/updateApplicationStatus/:applicationId",
  validation(validators.updateApplication),
  authentication(),
  applicationServices.updateApplication
);
