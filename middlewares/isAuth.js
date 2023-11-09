import jwt from "jsonwebtoken";
import { JWT_KEY } from "../keys.js";

export default async (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_KEY);
      const user_id = decoded.user_id;
      req.user_id = user_id;
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({
        message: "No access",
      });
    }
  } else {
    return res.status(403).json({
      message: "No access",
    });
  }
};
