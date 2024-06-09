"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(401).json({
                message: "Session expired, Please login again!",
            });
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        req["user_id"] = user._id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Session expired, Please login again!",
        });
    }
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=auth.middleware.js.map