export const asyncHandler = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch((err) => {
      err.cause = err.cause || 500;

      return next(err);
    });
  };
};

export const globalErrorHandling = (error, req, res, next) => {
  //   console.log(err);
  if (process.env.MOOD == "DEV") {
    return res.status(error.cause || 500).json({
      message: error.message,
      stack: error.stack,
      details: error.details,
    });
  } else
    return res.status(error.cause).json({
      message: error.message,
    });
};
