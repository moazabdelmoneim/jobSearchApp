import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { authentication } from "../../middleware/authGraph.middleware.js";
import { companyType, userType } from "./types.js";
import { tokenTypes } from "../../utils/security/token.security.js";
import * as dbServices from "../../DB/db.service.js";
import companyModel from "../../DB/models/company.model.js";
import userModel from "../../DB/models/user.model.js";

export const getAllusersAndCompanies = {
  type: new GraphQLObjectType({
    name: "getAllusersAndCompanies",
    fields: {
      companies: { type: new GraphQLList(companyType) },
      users: { type: new GraphQLList(userType) },
    },
  }),
  args: {
    authorization: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
    const { authorization } = args;
    const user = await authentication({
      authorization,
      tokenType: tokenTypes.access,
    });
    if (!user) throw new Error("You are not authorized..!");
    if (user.role == "user") throw new Error("You are not authorized..!");
    const companies = dbServices.findAll({ model: companyModel });
    const users = dbServices.findAll({ model: userModel });

    return { companies, users };
  },
};
// Define queries
