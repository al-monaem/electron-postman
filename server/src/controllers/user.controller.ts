import { User } from "db/models";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const user = await User.findOne({ email }).lean();
    if (!user)
      return res.status(401).json({
        message: "Incorrect email or password",
      });

    const isPasswordSame = await bcrypt.compare(password, user.password);
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
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, emp_id } = req.body;

    let _user = await User.findOne({ email });
    if (_user)
      return res.status(400).json({
        message: "Email is already in use",
      });

    _user = await User.findOne({ username });
    if (_user)
      return res.status(400).json({
        message: "Username is already in use",
      });

    _user = await User.findOne({ emp_id });
    if (_user)
      return res.status(400).json({
        message: "Employee ID is already in use",
      });

    const user = new User({
      username,
      email,
      password,
      emp_id,
    });

    await user.save();
    return res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

const generateAccessToken = (user_id: string) => {
  return jwt.sign(
    {
      _id: user_id,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: `${process.env.JWT_ACCESS_LIFETIME}m`,
    }
  );
};

const generateRefreshToken = (user_id: string) => {
  return jwt.sign(
    {
      _id: user_id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: `${process.env.JWT_REFRESH_LIFETIME}m`,
    }
  );
};
