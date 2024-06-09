"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const models_1 = require("../db/models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Incorrect email or password",
            });
        }
        const user = await models_1.User.findOne({ email }).lean();
        if (!user)
            return res.status(401).json({
                message: "Incorrect email or password",
            });
        const isPasswordSame = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordSame)
            return res.status(401).json({
                message: "Incorrect email or password",
            });
        delete user.password;
        return res.status(200).json({
            user,
            accessToken: generateAccessToken(user._id.toString()),
            refreshToken: generateRefreshToken(user._id.toString()),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { email, password, username, emp_id } = req.body;
        let _user = await models_1.User.findOne({ email });
        if (_user)
            return res.status(400).json({
                message: "Email is already in use",
            });
        _user = await models_1.User.findOne({ username });
        if (_user)
            return res.status(400).json({
                message: "Username is already in use",
            });
        _user = await models_1.User.findOne({ emp_id });
        if (_user)
            return res.status(400).json({
                message: "Employee ID is already in use",
            });
        const user = new models_1.User({
            username,
            email,
            password,
            emp_id,
        });
        await user.save();
        return res.status(201).json({
            message: "Registration successful",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.register = register;
const generateAccessToken = (user_id) => {
    return jsonwebtoken_1.default.sign({
        _id: user_id,
    }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: `${process.env.JWT_ACCESS_LIFETIME}m`,
    });
};
const generateRefreshToken = (user_id) => {
    return jsonwebtoken_1.default.sign({
        _id: user_id,
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: `${process.env.JWT_REFRESH_LIFETIME}m`,
    });
};
//# sourceMappingURL=user.controller.js.map