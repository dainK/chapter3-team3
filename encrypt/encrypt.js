import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

const encryptPassword = (password) => {
  return CryptoJS.SHA3(password+process.env.ENCRYPT_PASSWORD, process.env.ENCRYPT_KEY).toString();
}

export { encryptPassword };