import { Router } from "express";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import * as jobServices from "./services/job.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./job.validation.js";
import { rolesT } from "../../DB/models/user.model.js";
import { applicationRouter } from "../application/application.controller.js";

export const jobRouter = Router({ mergeParams: true });
jobRouter.use("/:jobId/applications", applicationRouter);

jobRouter.post(
  "/createJob",
  validation(validators.createJobValidation),
  authentication(),
  jobServices.createJob
);
jobRouter.patch(
  "/updateJob/:jobId",
  validation(validators.updateJob),
  authentication(),
  jobServices.updateJob
);
jobRouter.delete(
  "/deleteJob/:jobId",
  validation(validators.updateJob),
  authentication(),
  jobServices.deleteJob
);

jobRouter.get(
  "/getAllJobs",
  validation(validators.getAllJobs),
  authentication(),
  jobServices.getAllJobs
);

jobRouter.get(
  "/filterJobs",
  validation(validators.filterJobs),
  authentication(),
  jobServices.getFilteredJobs
);
jobRouter.get(
  "/getAllAplicationsForJob",
  validation(validators.getAllApplications),
  authentication(),
  jobServices.getAllAplicationsForJob
);

//
