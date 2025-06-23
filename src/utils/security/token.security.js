import jwt from "jsonwebtoken";
import * as dbServices from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";
export const tokenTypes = {
  access: "access",
  refresh: "refresh",
};

export const generateToken = async ({
  payload,
  expiresIn = "30min",
  signature = process.env.USER_ACCESS_TOKEN,
}) => {
  const token = jwt.sign(payload, signature, { expiresIn });
  return token;
};

export const verifyToken = async ({
  token,
  signature = process.env.USER_ACCESS_TOKEN,
}) => {
  try {
    const decoded = jwt.verify(token, signature);
    // console.log(decoded);

    return decoded;
  } catch (err) {
    throw new Error("the token is expired", {
      cause: 401,
    });
  }
};

export const decodeToken = async ({ authorization = "", tokenType, next }) => {
  if (!authorization) {
    return next(new Error("Invalid token", { cause: 400 }));
  }
  const [bareer, token] = authorization.split(" ") || [];

  if (!bareer || !token) {
    return next(new Error("Invalid token", { cause: 400 }));
  }

  let accessSignature = "";
  let refreshSignature = "";

  switch (bareer) {
    case "Bearer":
      accessSignature = process.env.USER_ACCESS_TOKEN;
      refreshSignature = process.env.USER_REFRESH_TOKEN;
      break;
    case "System":
      accessSignature = process.env.ADMIN_ACCESS_TOKEN;
      refreshSignature = process.env.ADMIN_REFRESH_TOKEN;
      break;
    default:
      next(new Error("Invalid token payload", { cause: 400 }));
  }
  // console.log(accessSignature);
  const signature =
    tokenType === tokenTypes.access ? accessSignature : refreshSignature;
  const decoded = jwt.verify(token, signature);

  // const decoded = await verifyToken({
  //   token,
  //   signature:
  //     tokenType === tokenTypes.access ? accessSignature : refreshSignature,
  // });
  // console.log(decoded);

  if (!decoded.id)
    return next(new Error("Invalid token payload", { cause: 400 }));

  const user = await dbServices.findOne({
    model: userModel,
    filter: {
      _id: decoded.id,
      isDeleted: { $exists: false },
      isConfirmed: true,
    },
  });

  if (!user) {
    return next(new Error("User not Found", { cause: 400 }));
  }
  if (decoded.iat < parseInt(user.changeCredentials?.getTime() / 1000) || 0) {
    return next(new Error("Please Login again", { cause: 400 }));
  }
  return user;
};
