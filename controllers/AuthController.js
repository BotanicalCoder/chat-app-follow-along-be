import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { genSalt, hash } from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days

const createToken = (email, userid) => {
  return jwt.sign({ email, userid }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = new User({ email, password });
    await user.save();

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(201).json({
      message: "User created successfully",
      data: { ...user, password: null },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      message: "Login successful",
      data: { ...user._doc, password: null, __v: null },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
