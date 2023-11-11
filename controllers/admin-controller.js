import database from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../keys.js";

export const ADMlogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const findAdminQuery = "SELECT * FROM admins WHERE email = $1";
    const adminResult = await database.query(findAdminQuery, [email]);

    if (adminResult.rowCount === 0) {
      return res.status(404).json({
        message: "No accesse",
      });
    } else {
      const admin = adminResult.rows[0];
      const isValidPassword = await bcrypt.compare(password, admin.password);

      if (!isValidPassword) {
        return res.status(400).json({
          message: "No accesse",
        });
      } else {
        const adminId = admin.id;
        const role = "admin";

        const token = jwt.sign({ adminId, role }, JWT_KEY, {
          expiresIn: "30d",
        });

        res.json({ adminId: adminId, adminToken: token });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error login admin",
    });
  }
};

export const ADMRegister = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isAdminExistQuery = "SELECT * FROM admins WHERE email = $1";
    const isAdminExist = await database.query(isAdminExistQuery, [email]);

    if (isAdminExist.rowCount > 0) {
      return res.json({
        message: `Admin already exists`,
      });
    } else {
      const passwordHash = await bcrypt.hash(password.trim(), 10);

      const adminInsertQuery =
        "INSERT INTO admins (email ,password) VALUES ($1,$2) RETURNING id";

      const admin = await database.query(adminInsertQuery, [
        email,
        passwordHash,
      ]);
      const adminId = admin.rows[0].id;
      const role = "admin";
      const token = jwt.sign({ adminId, role }, JWT_KEY, {
        expiresIn: "30d",
      });

      return res.status(201).json({
        message: "Registration successful",
        adminId,
        adminToken: token,
      });
    }
  } catch (error) {
    console.error(`Registration error: ${error}`);
    return res.status(500).json({ message: "Registration failed" });
  }
};
export const ADMGetMe = async (req, res) => {
  const adminId = req.adminId;
  try {
    const findAdminQuery = "SELECT * FROM admins WHERE id = $1";
    const adminResult = await database.query(findAdminQuery, [adminId]);
    if (adminResult.rowCount === 0) {
      return res.status(404).json({
        message: "No admin found",
      });
    } else {
      const admin = adminResult.rows[0];
      res.json({ adminId: admin.id });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "No access",
    });
  }
};
export const createProduct = async (req, res) => {
  const { name, price, version, display, os, processor, ram, image } = req.body;

  try {
    const insertProductQuery = `
        INSERT INTO products (name, price, version, display, os, processor, ram, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;`;

    const productResult = await database.query(insertProductQuery, [
      name,
      price,
      version,
      display,
      os,
      processor,
      ram,
      image,
    ]);

    const createdProduct = productResult.rows[0].id;

    res.status(201).json({
      data: createdProduct,
      message: "Product created successfully.",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Failed to create product.",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, price, version, display, os, processor, ram, image } = req.body;

  try {
    const getProductQuery = "SELECT * FROM products WHERE id = $1;";
    const currentProductResult = await database.query(getProductQuery, [
      productId,
    ]);
    const currentProduct = currentProductResult.rows[0];

    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    const updatedProduct = {
      name: name || currentProduct.name,
      price: price || currentProduct.price,
      version: version || currentProduct.version,
      display: display || currentProduct.display,
      os: os || currentProduct.os,
      processor: processor || currentProduct.processor,
      ram: ram || currentProduct.ram,
      image: image || currentProduct.image,
    };

    const updateProductQuery = `
        UPDATE products
        SET name = $1, price = $2, version = $3, display = $4, os = $5, processor = $6, ram = $7, image = $8
        WHERE id = $9
        RETURNING *;`;

    const updatedProductResult = await database.query(updateProductQuery, [
      updatedProduct.name,
      updatedProduct.price,
      updatedProduct.version,
      updatedProduct.display,
      updatedProduct.os,
      updatedProduct.processor,
      updatedProduct.ram,
      updatedProduct.image,
      productId,
    ]);

    const finalUpdatedProduct = updatedProductResult.rows[0];

    res.status(200).json({
      data: finalUpdatedProduct,
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Failed to update product.",
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const getProductQuery = "SELECT * FROM products WHERE id = $1;";
    const productResult = await database.query(getProductQuery, [productId]);
    const product = productResult.rows[0];

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const deleteProductQuery =
      "DELETE FROM products WHERE id = $1 RETURNING *;";
    const deletedProductResult = await database.query(deleteProductQuery, [
      productId,
    ]);
    const deletedProduct = deletedProductResult.rows[0];

    res.status(200).json({
      data: deletedProduct,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Failed to delete product.",
    });
  }
};
