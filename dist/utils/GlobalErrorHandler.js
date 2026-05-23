const globalErrorHandler = (err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err
    });
};
export default globalErrorHandler;
//# sourceMappingURL=GlobalErrorHandler.js.map