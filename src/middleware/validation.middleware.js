import moment from "moment";
import Joi from "joi";
const validateAge = (value, helpers) => {
  // console.log(value, helpers);

  const dob = moment(value, "YYYY-MM-DD");
  const today = moment();
  const age = today.diff(dob, "years");
  if (age < 18) {
    return helpers.error("age.tooYoung");
  }
  return value;
};

export const generalFields = {
  firstname: Joi.string().min(2).max(30).trim(),
  lastname: Joi.string().min(2).max(30).trim(),
  name: Joi.string().min(2).max(30).trim(),
  email: Joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 3,
    tlds: { allow: ["com", "net", "org"] },
  }),
  password: Joi.string().pattern(
    new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/)
  ),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
  gender: Joi.string().valid("male", "female"),
  DOB: Joi.date().max("now").custom(validateAge, "age validation"),
  mobileNumber: Joi.string()
    .length(11)
    .pattern(/^01[0125][0-9]{8}$/),
  otp: Joi.string().min(4).max(4),
  id: Joi.string().min(24).max(24),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputs = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files?.length) {
      inputs.file = { ...req.files, ...req.file };
    }

    const validationError = schema.validate(inputs, {
      abortEarly: false,
    });

    if (validationError.error) {
      const error = new Error("there is error in validation");
      error.cause = 400;
      error.details = [...validationError.error.details];
      error.stack = error.stack;
      return next(error);
    }
    next();
  };
};
