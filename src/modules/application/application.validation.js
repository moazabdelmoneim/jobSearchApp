import Joi from "joi";

export const createApplication = Joi.object({
  jobId: Joi.string().required().messages({
    "string.empty": "Job ID cannot be empty",
  }),
  companyId: Joi.string().required().messages({
    "string.empty": "Company ID cannot be empty",
  }),
});

export const updateApplication = Joi.object({
  status: Joi.string()
    .valid("pending", "accepted", "rejected", "viewed", "in consideration")
    .required()
    .messages({
      "any.only":
        "Status must be one of: pending, accepted, rejected, viewed, in consideration.",
      "any.required": "Status is required.",
    }),
  jobId: Joi.string().required().messages({
    "string.empty": "Job ID cannot be empty.",
    "any.required": "Job ID is required.",
  }),
  companyId: Joi.string().required().messages({
    "string.empty": "Company ID cannot be empty.",
    "any.required": "Company ID is required.",
  }),
  applicationId: Joi.string().required().messages({
    "string.empty": "Application ID cannot be empty.",
    "any.required": "Application ID is required.",
  }),
});
