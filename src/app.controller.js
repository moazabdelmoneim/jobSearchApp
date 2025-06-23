import { GraphQLObjectType, GraphQLSchema } from "graphql";
import connectDB from "./DB/connections.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import startCronJob from "./utils/cronJobs.js";
import { globalErrorHandling } from "./utils/res/error.res.js";
import { createHandler } from "graphql-http/lib/use/express";
import expressPlayground from "graphql-playground-middleware-express";
import { getAllusersAndCompanies } from "./modules/admin/query.resolver.js";
import {
  approveCompany,
  banOrUnbanCompany,
  banOrUnbanUser,
} from "./modules/admin/mutation.resolver.js";
import { companyRouter } from "./modules/company/company.controller.js";
import { jobRouter } from "./modules/job/job.controller.js";

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Main_Query_name",
    description: "this for all qury functions",
    fields: {
      getAllusersAndCompanies,
    },
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation_graph",
    description: "this for all mutation functions",
    fields: {
      banOrUnbanUser,
      banOrUnbanCompany,
      approveCompany,
    },
  }),
});

export const bootStrap = (app, express) => {
  app.use(express.json());

  // app.get("/", (req, res, next) => {
  //   res.send("Hello World!");
  // });

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/job", jobRouter);
  app.get(
    "/graphPlayGround",
    expressPlayground.default({ endpoint: "/graphQL" })
  );

  app.use("/graphQL", createHandler({ schema }));

  //
  //
  //
  app.all("*", (req, res, next) => {
    next(new Error("Not Found Route", { cause: 404 }));
    // res.status(404).json({ message: "Not Found Route" });
  });
  app.use(globalErrorHandling);
  startCronJob();
  connectDB();
};
