import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { authentication } from "../../middleware/authGraph.middleware.js";
import { tokenTypes } from "../../utils/security/token.security.js";
import * as dbServices from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";
import companyModel from "../../DB/models/company.model.js";

export const banOrUnbanUser = {
  type: new GraphQLObjectType({
    name: "banOrUnbanUser",
    fields: {
      message: { type: GraphQLString },
    },
  }),
  args: {
    action: {
      type: new GraphQLEnumType({
        name: "action_for_user",
        values: {
          ban: { value: "ban" },
          unBan: { value: "unBan" },
        },
      }),
    },
    userId: { type: GraphQLID },
    authorization: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
    const { authorization, action, userId } = args;
    const user = await authentication({
      authorization,
      tokenType: tokenTypes.access,
    });
    if (!user) throw new Error("You are not authorized..!");
    if (user.role == "user") throw new Error("You are not authorized..!");
    const selectedUser = await dbServices.findOne({
      model: userModel,
      filter: {
        _id: userId,
      },
    });
    console.log(selectedUser);

    if (!selectedUser) throw new Error("User not found");

    if (action == "unBan") {
      if (!selectedUser.bannedAt) {
        throw new Error("User is not banned");
      }
    }
    if (action == "ban" && selectedUser.bannedAt) {
      throw new Error("User is already banned");
    }

    if (action == "ban") {
      selectedUser.bannedAt = Date.now();
      await selectedUser.save();
    } else {
      selectedUser.bannedAt = "";
      await selectedUser.save();
    }
    return {
      message: `user: ${
        selectedUser.firstname + " " + selectedUser.lastname
      } is ${action == "ban" ? "banned" : "unbanned"}`,
    };
  },
};
export const banOrUnbanCompany = {
  type: new GraphQLObjectType({
    name: "banOrUnbanCompany",
    fields: {
      message: { type: GraphQLString },
    },
  }),
  args: {
    action: {
      type: new GraphQLEnumType({
        name: "action_for_company",
        values: {
          ban: { value: "ban" },
          unBan: { value: "unBan" },
        },
      }),
    },
    userId: { type: GraphQLID },
    authorization: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
    const { authorization, action, userId } = args;
    const user = await authentication({
      authorization,
      tokenType: tokenTypes.access,
    });
    if (!user) throw new Error("You are not authorized..!");
    if (user.role == "user") throw new Error("You are not authorized..!");
    const selectedCompany = await dbServices.findOne({
      model: companyModel,
      filter: {
        _id: userId,
      },
    });
    console.log(selectedCompany);

    if (!selectedCompany) throw new Error("User not found");

    if (action == "unBan") {
      if (!selectedCompany.bannedAt) {
        throw new Error("User is not banned");
      }
    }
    if (action == "ban" && selectedCompany.bannedAt) {
      throw new Error("User is already banned");
    }

    if (action == "ban") {
      selectedCompany.bannedAt = Date.now();
      await selectedCompany.save();
    } else {
      selectedCompany.bannedAt = "";
      await selectedCompany.save();
    }
    return {
      message: `user: ${
        selectedCompany.firstname + " " + selectedCompany.lastname
      } is ${action == "ban" ? "banned" : "unbanned"}`,
    };
  },
};

export const approveCompany = {
  type: new GraphQLObjectType({
    name: "approveCompany",
    fields: {
      message: { type: GraphQLString },
    },
  }),
  args: {
    compnyId: { type: GraphQLID },
    authorization: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
    const { authorization, compnyId } = args;
    const user = await authentication({
      authorization,
      tokenType: tokenTypes.access,
    });
    if (!user) throw new Error("You are not authorized..!");
    if (user.role == "user") throw new Error("You are not authorized..!");

    const selectedCompany = await dbServices.findOne({
      model: companyModel,
      filter: {
        _id: compnyId,
      },
    });
    // console.log(selectedCompany);
    if (!selectedCompany) throw new Error("Company not found");
    if (selectedCompany.approvedByAdmin) {
      throw new Error("Company is already approved");
    }
    selectedCompany.approvedByAdmin = true;
    await selectedCompany.save();
    return {
      message: `Company: ${selectedCompany.companyName} is approved`,
    };
  },
};
