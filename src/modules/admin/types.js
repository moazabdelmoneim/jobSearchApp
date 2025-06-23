import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

// Define the Image input type
export const ImageInputType = new GraphQLObjectType({
  name: "ImageInput",
  fields: {
    secure_url: { type: GraphQLString },
    public_id: { type: GraphQLString },
  },
});

export const companyType = new GraphQLObjectType({
  name: "company_type",
  fields: {
    id: { type: GraphQLID },
    companyName: { type: GraphQLString },
    description: { type: GraphQLString },
    industry: { type: GraphQLString },
    address: { type: GraphQLString },
    numberOfEmployees: { type: GraphQLString },
    createdBy: { type: GraphQLString },
    logo: { type: ImageInputType },
    coverPic: { type: ImageInputType },
    HRs: {
      type: new GraphQLList(GraphQLID),
    },
    isDeleted: { type: GraphQLString },
    bannedAt: { type: GraphQLString },
    legalAttachment: { type: ImageInputType },
    approvedByAdmin: { type: GraphQLBoolean },
  },
});

export const userType = new GraphQLObjectType({
  name: "user_type",
  fields: {
    id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    provider: {
      type: new GraphQLEnumType({
        name: "providerEnum",
        values: {
          system: { value: "system" },
          google: { value: "google" },
        },
      }),
    },
    gender: {
      type: new GraphQLEnumType({
        name: "genderEnum",
        values: {
          male: { value: "male" },
          female: { value: "female" },
        },
      }),
    },
    DOB: { type: GraphQLString },
    role: {
      type: new GraphQLEnumType({
        name: "roleEnum",
        values: {
          admin: { value: "admin" },
          user: { value: "user" },
        },
      }),
    },
    mobileNumber: { type: GraphQLString },
    isConfirmed: { type: GraphQLBoolean },
    isDeleted: { type: GraphQLString },
    bannedAt: { type: GraphQLString },
    updatedBy: { type: GraphQLID },
    changeCredentials: { type: GraphQLString },
    profilePic: { type: ImageInputType },
    coverPic: { type: ImageInputType },
  },
});
