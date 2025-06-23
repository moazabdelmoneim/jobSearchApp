import { Router } from "express";
import * as userServvices from "./services/user.service.js";
import { authentication } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./user.validation.js";
import {
  fileValidationTypes,
  uploadCloudfile,
} from "../../utils/multer/cloud.multer.js";

const userRouter = Router();

userRouter.patch(
  "/updateUser",
  validation(validators.updateUserValidation),
  authentication(),
  userServvices.updateUser
);
userRouter.get("/getUserData", authentication(), userServvices.getUserData);
userRouter.get("/:userId", authentication(), userServvices.getUserById);
userRouter.patch(
  "/updatePassword",
  validation(validators.updatePasswordValidation),
  authentication(),
  userServvices.updatePassword
);

userRouter.patch(
  "/updateProfilePicture",
  uploadCloudfile(fileValidationTypes.image).single("profilePic"),
  authentication(),
  userServvices.uploadProfilePic
);
userRouter.patch(
  "/updateCoverPicture",
  uploadCloudfile(fileValidationTypes.image).single("coverPic"),
  authentication(),
  userServvices.uploadCoverPic
);

userRouter.delete(
  "/deleteProfilePic",
  authentication(),
  userServvices.deleteProfilePic
);
userRouter.delete(
  "/deleteCoverPic",
  authentication(),
  userServvices.deleteCoverPic
);
userRouter.delete("/user", authentication(), userServvices.softDeleteAccount);
export default userRouter;
