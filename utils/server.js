const serverError = (res, error) => {
  return res.status(500).json({
    status: false,
    message: 'Internal Server Error',
    error_message: error.toString(),
  });
};

module.exports = {
  serverError,
};
