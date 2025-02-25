const { verify } = require("jsonwebtoken");
const User = require("../models/User");

const protect = async function (req, res, next) {
  try {
    if (req.headers?.authorization?.startsWith("Bearer")) {
      //get user token
      const userToken = req.headers?.authorization?.split(" ")[1];

      //decode and verify token
      const decoded = verify(userToken, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({
          message: "Unauthorized! Invalid Token.",
        });
      }

      //attach user data to request
      req.user = await User.findById(decoded.id).select("-password");

      //move on
      next();
    } else {
      return res.status(401).json({
        message: "Unauthorized! Missing Token.",
      });
    }
  } catch (err) {
    return res.status(401).json({
      message: `Unauthorized! ${err.message}`,
    });
  }
};

module.exports = { protect };
