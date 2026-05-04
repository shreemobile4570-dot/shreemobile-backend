// not Found

const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler

const errorHandler = (err, req, res, next) => {
  const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statuscode);
  const payload = {
    status: "fail",
    message: err?.message,
  };

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err?.stack;
  }

  res.json(payload);
};

module.exports = { errorHandler, notFound };
