import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

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

    const user = await User.create({ email, password });

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res
      .status(201)
      .json({ message: "User created successfully", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
