import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const updateUserValidation = Joi.object().keys({
  mobileNumber: generalFields.mobileNumber,
  DOB: generalFields.DOB,
  firstname: generalFields.firstname,
  lastname: generalFields.lastname,
  gender: generalFields.gender,
});
export const getUserById = Joi.object().keys({
  userId: generalFields.id.required(),
});

export const updatePasswordValidation = Joi.object().keys({
  oldPassword: generalFields.password.required(),
  newPassword: generalFields.password.not(Joi.ref("oldPassword")).required(),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});
