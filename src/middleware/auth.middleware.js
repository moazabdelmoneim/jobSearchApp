import { asyncHandler } from "../utils/res/error.res.js";
import { decodeToken, tokenTypes } from "../utils/security/token.security.js";

export const authentication = (tokenType = tokenTypes.access) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    // console.log(authorization);

    req.user = await decodeToken({ authorization, tokenType, next });
    // console.log(req.user);
    // if (req.user) return next(new Error("Invalid token", { cause: 401 }));

    return next();
  });
};

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (!accessRoles.includes(role)) {
      return next(new Error("You are not authorized", { cause: 403 }));
    }
    return next();
  });
};
