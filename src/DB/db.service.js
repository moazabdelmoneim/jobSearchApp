export const create = async ({ model, data, options }) => {
  const doc = await model.create(data, options);
  return doc;
};

export const findAll = async ({
  model,
  filter = {},
  select = "",
  populate = [],
  skip = 0,
  limit = 1000,
  sort,
} = {}) => {
  const docs = await model
    .find(filter)
    .select(select)
    .populate(populate)
    .skip(skip)
    .limit(limit)
    .sort(sort);
  return docs;
};
export const findOne = async ({
  model,
  filter = {},
  select = "",
  populate = [],
} = {}) => {
  const docs = await model.findOne(filter).select(select).populate(populate);
  return docs;
};
export const findOneAndUpdate = async ({
  model,
  filter = {},
  data = {},
  options = {},
  select = "",
  populate = [],
} = {}) => {
  const docs = await model
    .findOneAndUpdate(filter, data, options)
    .select(select)
    .populate(populate);

  return docs;
};
export const findByIdAndUpdate = async ({
  model,
  id = "",
  data = {},
  options = {},
  select = "",
  populate = [],
} = {}) => {
  const docs = await model
    .findByIdAndUpdate(id, data, options)
    .select(select)
    .populate(populate);

  return docs;
};

export const updateOne = async ({
  model,
  filter = {},
  data = {},
  options = {},
} = {}) => {
  const docs = await model.updateOne(filter, data, options);

  return docs;
};

export const updateMany = async ({
  model,
  filter = {},
  data = {},
  options = {},
} = {}) => {
  const docs = await model.find(filter, data, options);

  return docs;
};
export const findOneAndDelete = async ({
  model,
  filter = {},
  data = {},
  select = "",
  populate = [],
} = {}) => {
  const docs = await model
    .findOneAndDelete(filter, data)
    .select(select)
    .populate(populate);

  return docs;
};
export const findByIdAndDelete = async ({
  model,
  id = "",
  select = "",
  populate = [],
} = {}) => {
  const docs = await model
    .findByIdAndDelete(id)
    .select(select)
    .populate(populate);

  return docs;
};
export const deleteOne = async ({ model, filter = {} } = {}) => {
  const docs = await model.deleteOne(filter);

  return docs;
};
export const deleteMany = async ({ model, filter = {}, data = {} } = {}) => {
  const docs = await model.deleteMany(filter, data);

  return docs;
};
