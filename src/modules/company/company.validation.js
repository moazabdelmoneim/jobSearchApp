import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createCompany = Joi.object().keys({
  companyName: generalFields.name.required(),
  description: Joi.string().required(),
  industry: Joi.string().required(),
  address: Joi.string().required(),
  numberOfEmployees: Joi.string()
    .pattern(/^\d+-\d+$/)
    .message("must be a range such as 11-20 employees.")
    .required(),
  companyEmail: generalFields.email.required(),
  HRs: Joi.array().items(Joi.string()),
  //   legalAttachment: Joi.string().required(),
});

export const updateCompany = Joi.object().keys({
  companyId: generalFields.id.required(),
  companyName: generalFields.name,
  description: Joi.string(),
  industry: Joi.string(),
  address: Joi.string(),
  numberOfEmployees: Joi.string()
    .pattern(/^\d+-\d+$/)
    .message("must be a range such as 11-20 employees."),

  companyEmail: generalFields.email,
  HRs: Joi.array().items(Joi.string()),
  //   legalAttachment: Joi.string()
});
export const softDeleteCompany = Joi.object().keys({
  companyId: generalFields.id.required(),
});
export const CompanyId = Joi.object().keys({
  companyId: generalFields.id.required(),
});
export const getcompanyByName = Joi.object().keys({
  name: generalFields.name.required(),
});

export const getAllApplicationWithExcel = Joi.object().keys({
  companyId: generalFields.id.required(),
  date: Joi.date().required(),
});
