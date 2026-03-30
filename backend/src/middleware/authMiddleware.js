const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
        return res.status(401).json({
            message: "Token missing"
        });
    }
    const token = authHeaders.split(" ")[1];
 try {
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   req.user = decoded;
   next();
 } catch (err) {
   console.log("VERIFY ERROR:", err.message);
   return res.status(401).json({ message: "Invalid token" });
 }
}
module.exports = authMiddleware;