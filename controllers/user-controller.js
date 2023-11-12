import database from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../keys.js";

export const login = async (req, res) => {
  const { password, email } = req.body;
  try {
    const searchUserQuery = "SELECT * FROM users WHERE email = $1";
    const result = await database.query(searchUserQuery, [email]);

    if (result.rowCount === 0) {
      res.status(404).json({
        message: "error login",
      });
    } else {
      const user = result.rows[0];
      const isValidPass = await bcrypt.compare(password, user.password_hash);

      if (!isValidPass) {
        res.status(400).json({
          message: "error login",
        });
      } else {
        const user_id = user.id;
        const token = jwt.sign({ user_id }, JWT_KEY, {
          expiresIn: "30d",
        });

        res.json({
          fullName: user.fullname,
          email,
          token,
          id: user_id,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error login",
    });
  }
};

export const register = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    const isUserExistQuery = "SELECT * FROM users WHERE email = $1";
    const isUserExist = await database.query(isUserExistQuery, [email]);

    if (isUserExist.rowCount > 0) {
      res.json({
        message: "this user already exist",
      });
    } else {
      const passHash = await bcrypt.hash(password.trim(), 10);

      const insertQuery =
        "INSERT INTO users (fullname, email ,password_hash) VALUES ($1,$2,$3) RETURNING id";

      const user = await database.query(insertQuery, [
        fullName.trim(),
        email.trim(),
        passHash,
      ]);

      const user_id = user.rows[0].id;
      const token = jwt.sign({ user_id }, JWT_KEY, {
        expiresIn: "30d",
      });

      return res.status(201).json({
        message: "Registration successful",
        fullName,
        email,
        token,
        id: user_id,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error register",
    });
  }
};

export const getMe = async (req, res) => {
  const user_id = req.user_id;
  try {
    const findUserQuery = "SELECT * FROM users WHERE id = $1";
    const userResult = await database.query(findUserQuery, [user_id]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        message: "No user found",
      });
    } else {
      const user = userResult.rows[0];
      res.json({ id: user.id, fullName: user.fullname, email: user.email });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "No access",
    });
  }
};
