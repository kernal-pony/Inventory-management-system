
import { pool } from "../db.js";

export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to load products:", error);
    res.status(500).json({ error: "Failed to load products" });
  }
};

export const addProduct = async (req, res) => {
  const {
    sku,
    name,
    category_id,
    price,
    quantity,
    reorder_level
  } = req.body;

  try {
    if (
      !sku ||
      !name ||
      price == null ||
      quantity == null ||
      reorder_level == null
    ) {
      return res.status(400).json({
        error: "All required product fields must be provided"
      });
    }

    if (
      Number(price) < 0 ||
      Number(quantity) < 0 ||
      Number(reorder_level) < 0
    ) {
      return res.status(400).json({
        error: "Price, quantity and reorder level cannot be negative"
      });
    }

    const result = await pool.query(
      `INSERT INTO products
       (sku, name, category_id, price, quantity, reorder_level)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        sku,
        name,
        category_id ?? null,
        price,
        quantity,
        reorder_level
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to add product:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Product SKU already exists"
      });
    }

    res.status(500).json({ error: "Failed to add product" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  const {
    sku,
    name,
    category_id,
    price,
    quantity,
    reorder_level
  } = req.body;

  try {
    if (
      !sku ||
      !name ||
      price == null ||
      quantity == null ||
      reorder_level == null
    ) {
      return res.status(400).json({
        error: "All required product fields must be provided"
      });
    }

    if (
      Number(price) < 0 ||
      Number(quantity) < 0 ||
      Number(reorder_level) < 0
    ) {
      return res.status(400).json({
        error: "Price, quantity and reorder level cannot be negative"
      });
    }

    const result = await pool.query(
      `UPDATE products
       SET sku = $1,
           name = $2,
           category_id = $3,
           price = $4,
           quantity = $5,
           reorder_level = $6
       WHERE id = $7
       RETURNING *`,
      [
        sku,
        name,
        category_id ?? null,
        price,
        quantity,
        reorder_level,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update product:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Product SKU already exists"
      });
    }

    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const lowStock = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE quantity <= reorder_level ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to load low stock products:", error);
    res.status(500).json({
      error: "Failed to load low stock products"
    });
  }
};
