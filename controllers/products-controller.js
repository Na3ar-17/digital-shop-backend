import database from "../database.js";

export const getProducts = async (req, res) => {
  try {
    const query = "SELECT * FROM products;";
    const products = await database.query(query);
    const data = products.rows;
    res.status(200).json({
      data,
    });
  } catch (error) {
    console.error(`Error fetching products: ${error}`);
    res.status(500).json({
      message: "Can't get data",
    });
  }
};

export const addMyProducts = async (req, res) => {
  const { userId, productId, count } = req.body;

  try {
    const checkOrderQuery = "SELECT * FROM my_orders WHERE userId = $1";
    const checkOrderResult = await database.query(checkOrderQuery, [userId]);

    if (checkOrderResult.rows.length > 0) {
      const existingOrder = checkOrderResult.rows[0];
      const existingProductIndex = existingOrder.product_ids.indexOf(productId);

      if (existingProductIndex !== -1) {
        existingOrder.counts[existingProductIndex] += count;
      } else {
        existingOrder.product_ids.push(productId);
        existingOrder.counts.push(count);
      }

      const updateOrderQuery =
        "UPDATE my_orders SET product_ids = $1, counts = $2 WHERE userId = $3 RETURNING *";
      const updateOrderResult = await database.query(updateOrderQuery, [
        existingOrder.product_ids,
        existingOrder.counts,
        userId,
      ]);

      res.status(200).json({
        data: updateOrderResult.rows[0],
      });
    } else {
      const insertOrderQuery =
        "INSERT INTO my_orders (userId, product_ids, counts) VALUES ($1, ARRAY[$2]::integer[], ARRAY[$3]::integer[]) RETURNING *";
      const insertOrderResult = await database.query(insertOrderQuery, [
        userId,
        productId,
        count,
      ]);

      res.status(200).json({
        data: insertOrderResult.rows[0],
      });
    }
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      message: "Failed to add product",
    });
  }
};

export const getMyProducts = async (req, res) => {
  const { userId } = req.params;
  try {
    const getOrderQuery =
      "SELECT product_ids, counts FROM my_orders WHERE userId = $1";
    const orderResult = await database.query(getOrderQuery, [userId]);

    if (orderResult.rows.length > 0) {
      const productIds = orderResult.rows[0].product_ids;
      const counts = orderResult.rows[0].counts;

      if (productIds.length === 0) {
        return res
          .status(200)
          .json({ message: "No products found for the specified user." });
      }

      const getProductsQuery =
        "SELECT * FROM products WHERE id = ANY($1::integer[])";
      const productsResult = await database.query(getProductsQuery, [
        productIds,
      ]);

      const resultArray = productsResult.rows.map((product, index) => ({
        product_id: product.id,
        count: counts[index],
        name: product.name,
        price: product.price,
        version: product.version,
        display: product.display,
        os: product.os,
        processor: product.processor,
        ram: product.ram,
        image: product.image,
      }));

      res.status(200).json({
        data: resultArray,
      });
    } else {
      res.status(404).json({
        message: "No products found for the specified user.",
      });
    }
  } catch (error) {
    console.error("Error getting user products:", error);
    res.status(500).json({
      message: "Failed to get user products",
    });
  }
};

export const deleteMyProducts = async (req, res) => {
  const { userId } = req.params;
  try {
    const deleteQuery = "DELETE FROM my_orders WHERE userid = $1";
    const result = await database.query(deleteQuery, [userId]);
    console.log(result.rows);
    if (result.rowCount > 0) {
      res.status(200).json({ message: "My products deleted successfully" });
    } else {
      res.status(404).json({ message: "No my products found to delete" });
    }
  } catch (error) {
    console.error("Error deleting my products:", error);
    res.status(500).json({ message: "Failed to delete my products" });
  }
};
export const deleteOneMyProduct = async (req, res) => {
  const { productId, userId } = req.params;

  try {
    const updateOrderQuery = `
        UPDATE my_orders 
        SET 
          product_ids = ARRAY_REMOVE(product_ids, $1),
          counts = array_remove(counts, (SELECT counts[i] FROM unnest(product_ids) WITH ORDINALITY arr(id, i) WHERE id = $1)::integer)
        WHERE userid = $2;
      `;

    const data = await database.query(updateOrderQuery, [productId, userId]);

    if (data.rowCount === 0) {
      res.status(404).json({ message: "Item not found for deletion." });
    } else {
      res.status(200).json({ message: "Item deleted successfully." });
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getOneProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const query = "SELECT * FROM products WHERE id = $1";
    const product = await database.query(query, [id]);
    const data = product.rows;
    res.status(200).json({
      data,
    });
  } catch (error) {
    console.error(`Error fetching products: ${error}`);
    res.status(500).json({
      message: "Can't get data",
    });
  }
};
