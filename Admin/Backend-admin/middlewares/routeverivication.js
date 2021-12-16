const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //console.log(req.headers.authorization);
    const token = req.headers.authorization;
    //console.log('Jk',req.headers);
    const decoded = jwt.verify(token, process.env.JWT_KEY || "serectserect");
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
