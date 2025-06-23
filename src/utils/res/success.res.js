export const success = async ({ res, data = "done", status = 200 }) => {
  return res.status(status).json({
    ...data,
  });
};
