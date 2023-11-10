import express from "express";
import cors from "cors";
import { getMe, login, register } from "./controllers/user-controller.js";
import isAuth from "./middlewares/isAuth.js";
import {
  addMyProducts,
  deleteMyProducts,
  deleteOneMyProduct,
  getMyProducts,
  getOneProduct,
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
app.get("/get-one-product/:id", getOneProduct);
app.get("/products", getProducts);
app.get("/get-my-products/:userId", isAuth, getMyProducts);

app.post("/add-my-products", isAuth, addMyProducts);
app.post("/delete-my-products/:userId", isAuth, deleteMyProducts);
app.post(
  "/delete-one-my-product/:userId/:productId",
  isAuth,
  deleteOneMyProduct
);
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
