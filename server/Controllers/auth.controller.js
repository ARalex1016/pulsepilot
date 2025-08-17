import bcrypt from "bcryptjs";

// Models
import User from "./../Models/user.model.js";

// Utils
import { generateJwtToken, verifyJwtToken } from "../Utils/jwtToken.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "All Fields are required!",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        status: "errro",
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateJwtToken(user, res);

    const { password: _, ...userWithoutPassword } = user.toObject();

    const response = {
      status: "success",
      message: "Signed up successfully!",
      data: userWithoutPassword,
    };

    // Include token only in development
    if (process.env.NODE_ENV === "development") {
      response.token = token;
    }

    // Success
    res.status(201).json(response);
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "All Fields are required!",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "errro",
        message: "User with this email doesn't exist",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        status: "error",
        message: "Password doesn't match",
      });
    }

    const token = generateJwtToken(user, res);

    const { password: _, ...userWithoutPassword } = user.toObject();

    const response = {
      status: "success",
      message: "Logged in Successful!",
      data: userWithoutPassword,
    };

    // Include token only in development
    if (process.env.NODE_ENV === "development") {
      response.token = token;
    }

    // Success
    res.status(200).json(response);
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const protect = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized: No token provided",
    });
  }

  try {
    const decodedToken = verifyJwtToken(token);

    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Forbidden: The user no longer exists!",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

export const checkAuth = (req, res) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
    });

    // Success
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const me = async (req, res) => {
  const { user } = req;

  // Success
  res.status(200).json({
    status: "success",
    message: "Successfully retrieved user data",
    data: user,
  });
};
