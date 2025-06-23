import jwt from "jsonwebtoken";
import * as dbServices from "../DB/db.service.js";
import userModel from "../DB/models/user.model.js";
import { tokenTypes } from "../utils/security/token.security.js";

export const authentication = async ({ authorization, tokenType }) => {
  // const { authorization } = req.headers;
  if (!authorization) throw new Error("authorization is required");

  const [bearer, token] = authorization?.split(" ") || [];
  // console.log(authorization);

  if (!bearer || !token) {
    throw new Error("Authorization is required or invalid formated");
  }
  let accessSignature = "";
  let refreshSignature = "";
  switch (bearer) {
    case "Bearer":
      accessSignature = process.env.USER_ACCESS_TOKEN;
      refreshSignature = process.env.USER_REFRESH_TOKEN;
      break;
    case "System":
      accessSignature = process.env.ADMIN_ACCESS_TOKEN;
      refreshSignature = process.env.ADMIN_REFRESH_TOKEN;
      break;
    default:
      throw new Error("Invalid token payload");
  }

  const signature =
    tokenType === tokenTypes.access ? accessSignature : refreshSignature;
  const decoded = jwt.verify(token, signature);
  // console.log(decoded);

  if (!decoded.id) throw new Error("Invalid token payload");

  const user = await dbServices.findOne({
    model: userModel,
    filter: {
      _id: decoded.id,
      isDeleted: { $exists: false },
      isConfirmed: true,
    },
  });

  if (!user) throw new Error("User not found");

  if (decoded.iat < parseInt(user.changeCredentials?.getTime() / 1000) || 0) {
    throw new Error("Please login again");
  }
  return user;
};
