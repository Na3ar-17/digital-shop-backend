import express from "express";
import cors from "cors";
import { getMe, login, register } from "./controllers/user-controller.js";
import isAuth from "./middlewares/isAuth.js";
import {
  addMyProducts,
  deleteMyProducts,
  getProducts,
} from "./controllers/products-controller.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4444;

/*Користувач*/
app.get("/get-me", isAuth, getMe);
app.post("/login", login);
app.post("/register", register);
/**/

/*Товари*/
app.get("/products", getProducts);
app.post("/add-my-products", addMyProducts);
app.post("/delete-my-products", deleteMyProducts);
/**/

/*Сервер*/
try {
  app.listen(PORT, () => {
    console.log(`server was started in port ${PORT}`);
  });
} catch (error) {
  console.log(`server start error: ${error}`);
}
/**/
