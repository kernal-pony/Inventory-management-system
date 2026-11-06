
import { pool } from "../db.js";

// STOCK IN
export const stockIn = async (req, res) => {
  const { product_id, qty, note } = req.body;

  if (
    !Number.isInteger(Number(product_id)) ||
    Number(product_id) <= 0 ||
    !Number.isInteger(Number(qty)) ||
    Number(qty) <= 0
  ) {
    return res.status(400).json({
      message: "Valid product_id and positive quantity are required"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const product = await client.query(
      "SELECT id FROM products WHERE id = $1 FOR UPDATE",
      [product_id]
    );

    if (product.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found" });
    }

    await client.query(
      "UPDATE products SET quantity = quantity + $1 WHERE id = $2",
      [qty, product_id]
    );

    const movement = await client.query(
      `INSERT INTO stock_movements
       (product_id, type, qty, note)
       VALUES ($1, 'IN', $2, $3)
       RETURNING *`,
      [product_id, qty, note || null]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Stock IN successful",
      movement: movement.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Stock IN error:", error);

    res.status(500).json({
      error: "Failed to add stock"
    });
  } finally {
    client.release();
  }
};


// STOCK OUT
export const stockOut = async (req, res) => {
  const { product_id, qty, note } = req.body;

  if (
    !Number.isInteger(Number(product_id)) ||
    Number(product_id) <= 0 ||
    !Number.isInteger(Number(qty)) ||
    Number(qty) <= 0
  ) {
    return res.status(400).json({
      message: "Valid product_id and positive quantity are required"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const product = await client.query(
      "SELECT quantity FROM products WHERE id = $1 FOR UPDATE",
      [product_id]
    );

    if (product.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found" });
    }

    const currentQty = Number(product.rows[0].quantity);

    if (currentQty < Number(qty)) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: `Not enough stock. Current stock: ${currentQty}`
      });
    }

    await client.query(
      "UPDATE products SET quantity = quantity - $1 WHERE id = $2",
      [qty, product_id]
    );

    const movement = await client.query(
      `INSERT INTO stock_movements
       (product_id, type, qty, note)
       VALUES ($1, 'OUT', $2, $3)
       RETURNING *`,
      [product_id, qty, note || null]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Stock OUT successful",
      movement: movement.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Stock OUT error:", error);

    res.status(500).json({
      error: "Failed to remove stock"
    });
  } finally {
    client.release();
  }
};


// STOCK HISTORY
export const stockHistory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, p.sku, p.name
      FROM stock_movements m
      JOIN products p ON p.id = m.product_id
      ORDER BY m.id DESC
      LIMIT 200
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Stock history error:", error);

    res.status(500).json({
      error: "Failed to load stock history"
    });
  }
};
