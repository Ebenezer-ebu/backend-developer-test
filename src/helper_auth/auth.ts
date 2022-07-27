import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const secretKey = process.env.SECRET_KEY;
const saltRounds = process.env.SALT;

export async function hashPassword(password: string) {
  const hash = await bcrypt.hash(password, Number(saltRounds));
  return hash;
}

export async function checkUserPassword(
  password: string,
  hashedPassword: string
) {
  //... fetch user from a db etc.
  const match = await bcrypt.compare(password, hashedPassword);
  if (match) {
    //login
    return true;
  } else {
    return false;
  }
}

// const generateToken = async (payload, secret = secretKey) => {
//   try {
//     const token = await jwt.sign(payload, secret, { expiresIn: "1d" });
//     return token;
//   } catch (err) {
//     console.log(err);
//   }
// };

// const verifyToken = async (token, secret = secretKey) => {
//   const decoded = await jwt.verify(token, secret);
//   return decoded;
// };

module.exports = {
  hashPassword,
  checkUserPassword,
  //   generateToken,
  //   verifyToken,
};
