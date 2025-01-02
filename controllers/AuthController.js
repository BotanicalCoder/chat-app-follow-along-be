import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { renameSync, unlinkSync } from "fs";
import path from "path";

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

export const get_user_info = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    return res.status(200).json({
      message: "user retrieved successfully",
      data: { ...user._doc, password: null, __v: null },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const update_profile = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    const { first_name, last_name, color } = req.body;

    if (!first_name || !last_name || !color) {
      return res.status(400).json({ message: "Please provide all the fields" });
    }

    const userData = await User.findByIdAndUpdate(
      user.id,
      { first_name, last_name, color, profile_setup: true },
      { new: true }
    );

    return res.status(200).json({
      message: "user data updated successfully",
      data: { ...userData._doc, password: null, __v: null },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const add_profile_image = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please provide a file" });
    }

    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    const date = Date.now();
    const fileName =
      `${date}-${req.user.email}-${req.file.originalname}`.replace(/\s+/g, "-");

    renameSync(
      req.file.path,
      `uploads/profiles/${fileName}`.replace(/\s+/g, "-")
    );

    const userData = await User.findByIdAndUpdate(
      user.id,
      { img: fileName },
      { new: true }
    );

    return res.status(200).json({
      message: "user data updated successfully",
      data: { ...userData._doc, password: null, __v: null },
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const remove_profile_image = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    unlinkSync(`./uploads/profiles/${user.img}`);

    const userData = await User.findByIdAndUpdate(
      user.id,
      { img: "" },
      { new: true }
    );

    return res.status(200).json({
      message: "user data updated successfully",
      data: { ...userData._doc, password: null, __v: null },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", {
      maxAge: 1,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
