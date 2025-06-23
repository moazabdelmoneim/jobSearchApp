import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const signupValidate = Joi.object().keys({
  firstname: generalFields.firstname.required(),
  lastname: generalFields.lastname.required(),
  email: generalFields.email.required(),
  password: generalFields.password.required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  gender: generalFields.gender.required(),
  DOB: generalFields.DOB.required(),
  mobileNumber: generalFields.mobileNumber.required(),
});

export const confirmeEmailValidate = Joi.object().keys({
  email: generalFields.email.required(),
  otp: generalFields.otp.required(),
});

export const loginValidate = Joi.object().keys({
  email: generalFields.email.required(),
  password: generalFields.password.required(),
});

export const forgetPasswordValidate = Joi.object().keys({
  email: generalFields.email.required(),
});

export const resetPasswordValidate = Joi.object().keys({
  email: generalFields.email.required(),
  otp: generalFields.otp.required(),
  password: generalFields.password.required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});
