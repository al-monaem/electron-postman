import { Response } from "express";
import jwt from "jsonwebtoken";

export const verifyJWT = (req: any, res: Response, next: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({
        message: "Session expired, Please login again!",
      });

    const user: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req["user_id"] = user._id;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Session expired, Please login again!",
    });
  }
};
