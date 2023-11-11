import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import { getMe, login, register } from "./controllers/user-controller.js";
import isAuth from "./middlewares/isAuth.js";
import isAdmin from "./middlewares/isAdmin.js";
import {
  addMyProducts,
  deleteMyProducts,
  deleteOneMyProduct,
  getMyProducts,
  getOneProduct,
  getProducts,
} from "./controllers/products-controller.js";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  ADMlogin,
  ADMGetMe,
  ADMRegister,
} from "./controllers/admin-controller.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4444;

/*Завантаження картинок*/
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads");
  },
  filename: async (req, file, cb) => {
    const fileName = file.originalname;
    try {
      const files = await fs.promises.readdir("uploads");
      req.fileExists = files.includes(fileName);
      cb(null, fileName);
    } catch (err) {
      console.error(err);
      cb(err);
    }
  },
});

const upload = multer({ storage });

app.post("/upload", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const fileName = req.file.originalname;
    if (req.fileExists) {
      return res
        .status(400)
        .json({ message: "File with this name already exists" });
    } else {
      return res.json({ url: `${fileName}` });
    }
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ message: "Failed to handle file upload" });
  }
});

/**/

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

/*Адміністратор*/
app.post("/adm-login", isAuth, ADMlogin);
app.post("/adm-register", isAuth, ADMRegister);
app.get("/get-admin", isAdmin, ADMGetMe);
app.post("/product", isAdmin, createProduct);
app.patch("/product/:productId", isAdmin, updateProduct);
app.delete("/product/:productId", isAdmin, deleteProduct);
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
