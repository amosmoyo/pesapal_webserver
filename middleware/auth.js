const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = async (res, req, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
      // Set token from cookie
    }
    // else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

    // Make sure token exists
    if (!token) {
      //   return next(new ErrorResponse('Not authorized to access this route', 401));
      return res.status(401).json({
        message: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);

      next();
    } catch (err) {
      return res.status(401).json({
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
