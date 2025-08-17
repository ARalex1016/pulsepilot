import jwt from "jsonwebtoken";

export const generateJwtToken = (user, res) => {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return token;
};

export const verifyJwtToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
};
