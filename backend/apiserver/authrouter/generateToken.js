import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

export const generateToken = (user) => {
  const token = jwt.sign(user, secretKey, { expiresIn: "3h" });
  return token;
  //   console.log(user);
};
