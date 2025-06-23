import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createJobValidation = Joi.object({
  jobTitle: Joi.string().required().messages({
    "any.required": "Job title is required",
    "string.empty": "Job title cannot be empty",
  }),
  jobLocation: Joi.string()
    .valid("onsite", "remote", "hybrid")
    .required()
    .messages({
      "any.required": "Job location is required",
      "any.only": "Job location must be one of 'onsite', 'remote', or 'hybrid'",
    }),
  jobDescription: Joi.string().required().messages({
    "any.required": "Job description is required",
    "string.empty": "Job description cannot be empty",
  }),
  workingTime: Joi.string()
    .valid("full-time", "part-time")
    .required()
    .messages({
      "any.required": "Working time is required",
      "any.only": "Working time must be either 'full-time' or 'part-time'",
    }),
  seniorityLevel: Joi.string()
    .valid("fresh", "Junior", "Mid-Level", "Senior", "Team Lead", "CTO")
    .required()
    .messages({
      "any.required": "Seniority level is required",
      "any.only":
        "Seniority level must be one of 'fresh', 'Junior', 'Mid-Level', 'Senior', 'Team Lead', or 'CTO'",
    }),
  technicalSkills: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      "any.required": "Technical skills are required",
      "array.min": "At least one technical skill is required",
      "array.includesRequiredUnknowns": "Technical skills cannot be empty",
    }),
  softSkills: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      "any.required": "Soft skills are required",
      "array.min": "At least one soft skill is required",
      "array.includesRequiredUnknowns": "Soft skills cannot be empty",
    }),
  companyId: generalFields.id.required(),
});

export const updateJob = Joi.object({
  companyId: Joi.string().optional().messages({
    "string.empty": "Company ID cannot be empty",
  }),
  jobId: Joi.string().optional().messages({
    "string.empty": "Job ID cannot be empty",
  }),
  jobTitle: Joi.string().optional().messages({
    "string.empty": "Job title cannot be empty",
  }),
  jobLocation: Joi.string()
    .valid("onsite", "remote", "hybrid")
    .optional()
    .messages({
      "any.only": "Job location must be one of 'onsite', 'remote', or 'hybrid'",
    }),
  jobDescription: Joi.string().optional().messages({
    "string.empty": "Job description cannot be empty",
  }),
  workingTime: Joi.string()
    .valid("full-time", "part-time")
    .optional()
    .messages({
      "any.only": "Working time must be either 'full-time' or 'part-time'",
    }),
  seniorityLevel: Joi.string()
    .valid("fresh", "Junior", "Mid-Level", "Senior", "Team Lead", "CTO")
    .optional()
    .messages({
      "any.only":
        "Seniority level must be one of 'fresh', 'Junior', 'Mid-Level', 'Senior', 'Team Lead', or 'CTO'",
    }),
  technicalSkills: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .optional()
    .messages({
      "array.min": "At least one technical skill is required",
      "array.includesRequiredUnknowns": "Technical skills cannot be empty",
    }),
  softSkills: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .optional()
    .messages({
      "array.min": "At least one soft skill is required",
      "array.includesRequiredUnknowns": "Soft skills cannot be empty",
    }),
});

export const deleteJob = Joi.object({
  companyId: Joi.string().optional().messages({
    "string.empty": "Company ID cannot be empty",
  }),
  jobId: Joi.string().optional().messages({
    "string.empty": "Job ID cannot be empty",
  }),
});

export const getAllJobs = Joi.object({
  companyId: Joi.string().optional().messages({
    "string.empty": "Company ID cannot be empty",
  }),
  jobId: Joi.string().optional().messages({
    "string.empty": "Job ID cannot be empty",
  }),
  companyName: Joi.string().optional().messages({
    "string.empty": "Company name cannot be empty",
  }),
  skip: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Skip must be a number",
    "number.integer": "Skip must be an integer",
    "number.min": "Skip must be greater than or equal to 0",
  }),
  limit: Joi.number().integer().min(1).default(10).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be greater than or equal to 1",
  }),
  sort: Joi.string()
    .valid("createdAt", "-createdAt", "jobTitle", "-jobTitle")
    .default("-createdAt")
    .messages({
      "string.base": "Sort must be a string",
      "any.only":
        "Sort must be one of 'createdAt', '-createdAt', 'jobTitle', or '-jobTitle'",
    }),
});

export const filterJobs = Joi.object().keys({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be greater than or equal to 1",
  }),
  size: Joi.number().integer().min(1).default(10).messages({
    "number.base": "Size must be a number",
    "number.integer": "Size must be an integer",
    "number.min": "Size must be greater than or equal to 1",
  }),
  sort: Joi.string()
    .valid("createdAt", "-createdAt", "jobTitle", "-jobTitle")
    .default("-createdAt")
    .messages({
      "string.base": "Sort must be a string",
      "any.only":
        "Sort must be one of 'createdAt', '-createdAt', 'jobTitle', or '-jobTitle'",
    }),
  jobTitle: Joi.string().optional().messages({
    "string.empty": "Job title cannot be empty",
  }),
  jobLocation: Joi.string()
    .valid("onsite", "remote", "hybrid")
    .optional()
    .messages({
      "any.only": "Job location must be one of 'onsite', 'remote', or 'hybrid'",
    }),
  workingTime: Joi.string()
    .valid("full-time", "part-time")
    .optional()
    .messages({
      "any.only": "Working time must be either 'full-time' or 'part-time'",
    }),
  technicalSkills: Joi.string().optional().messages({
    "string.base": "Technical skills must be a string",
  }),
  seniorityLevel: Joi.string()
    .valid("fresh", "Junior", "Mid-Level", "Senior", "Team Lead", "CTO")
    .optional()
    .messages({
      "any.only":
        "Seniority level must be one of 'fresh', 'Junior', 'Mid-Level', 'Senior', 'Team Lead', or 'CTO'",
    }),
});

// export

export const getAllApplications = Joi.object({
  companyId: Joi.string().optional().messages({
    "string.empty": "Company ID cannot be empty",
  }),
  jobId: Joi.string().optional().messages({
    "string.empty": "Job ID cannot be empty",
  }),
  sort: Joi.string()
    .valid("createdAt", "-createdAt", "jobTitle", "-jobTitle")
    .default("-createdAt")
    .messages({
      "string.base": "Sort must be a string",
      "any.only":
        "Sort must be one of 'createdAt', '-createdAt', 'jobTitle', or '-jobTitle'",
    }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be greater than or equal to 1",
  }),
  size: Joi.number().integer().min(1).default(10).messages({
    "number.base": "Size must be a number",
    "number.integer": "Size must be an integer",
    "number.min": "Size must be greater than or equal to 1",
  }),
});

