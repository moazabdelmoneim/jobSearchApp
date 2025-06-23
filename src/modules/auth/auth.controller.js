import { Router } from "express";
import * as registrationServices from "./services/regestration.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./auth.validation.js";
import * as loginServices from "./services/login.service.js";
import {
  fileValidationTypes,
  uploadCloudfile,
} from "../../utils/multer/cloud.multer.js";
const authRouter = Router();

authRouter.get("/", (req, res, next) => {
  res.send("Hello World!");
});

authRouter.post(
  "/signup",
  validation(validators.signupValidate),
  registrationServices.signup
);
authRouter.post("/signupWithGmail", registrationServices.signupWithGmail);

authRouter.post(
  "/confirmEmail",
  validation(validators.confirmeEmailValidate),
  registrationServices.confirmEmail
);

authRouter.post(
  "/login",
  validation(validators.loginValidate),
  loginServices.login
);

authRouter.post("/loginWithGmail", loginServices.loginWithGmail);

authRouter.post(
  "/sendForgetPasswordOtp",
  validation(validators.forgetPasswordValidate),
  loginServices.sendForgetPasswordOtp
);

authRouter.post(
  "/resetPassword",
  validation(validators.resetPasswordValidate),
  loginServices.resetPassword
);

authRouter.get(
  "/refreshToken",
  // validation(validators.refreshToken),
  loginServices.refreshToken
);

export default authRouter;
