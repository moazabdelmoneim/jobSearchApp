import userModel, { rolesT } from "../../DB/models/user.model.js";
import * as dbServices from "../../DB/db.service.js";
import jwt from "jsonwebtoken";
export const verifyToken = async ({
  token,
  signature = process.env.USER_ACCESS_TOKEN,
}) => {
  try {
    const decoded = jwt.verify(token, signature);
    return decoded;
  } catch (err) {
    return new Error("the token is expired", {
      cause: 401,
    });
  }
};
export const authenticationSocket = async ({
  socket,
  tokenType = "access",
  roleTypes = rolesT.user,
}) => {
  const { authorization } = socket.handshake?.auth;

  if (!authorization)
    return {
      data: {
        statusCode: 400,
        message: "authorization is required",
      },
    };

  const [bearer, token] = authorization?.split(" ") || [];
  // console.log(authorization);

  if (!bearer || !token) {
    return {
      data: {
        statusCode: 400,
        message: "Authorization is required or invalid formated",
      },
    };
  }
  let accessSignature, refreshSignature;
  switch (bearer) {
    case "System":
      accessSignature = process.env.ADMIN_ACCESS_TOKEN;
      refreshSignature = process.env.ADMIN_REFRESH_TOKEN;
      break;
    case "Bearer":
      accessSignature = process.env.USER_ACCESS_TOKEN;
      refreshSignature = process.env.USER_REFRESH_TOKEN;
      break;
    default:
      throw new Error("Invalid token payload");
  }

  let decoded = await verifyToken({
    token,
    signature: tokenType === "access" ? accessSignature : refreshSignature,
  });

  if (decoded.message) {
    return {
      data: {
        statusCode: 400,
        message: "token expired",
      },
    };
  }

  const { id, iat } = decoded;
  if (!decoded.id)
    return {
      data: {
        statusCode: 400,
        message: "Invalid token payload",
      },
    };

  const user = await dbServices.findOne({
    model: userModel,
    filter: {
      _id: id,
      isDeleted: { $exists: false },
      isConfirmed: true,
    },
  });
  // console.log("user", user);

  if (!user)
    return {
      data: {
        statusCode: 400,
        message: "User not found",
      },
    };
  if (!roleTypes.includes(user.role))
    return { data: { statusCode: 400, message: "You are not authorized" } };

  if (
    decoded.iat < parseInt(user?.changeCridentialTime?.getTime() / 1000) ||
    0
  ) {
    return {
      data: {
        statusCode: 400,
        message: "Please login again",
      },
    };
  }

  return { data: { user, valid: true } };
};
