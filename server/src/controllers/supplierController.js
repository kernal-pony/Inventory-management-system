
import { pool } from "../db.js";

// GET ALL SUPPLIERS
export const getSuppliers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM suppliers ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to load suppliers:", error);

    res.status(500).json({
      error: "Failed to load suppliers"
    });
  }
};


// ADD SUPPLIER
export const addSupplier = async (req, res) => {
  const { name, phone, email, address } = req.body;

  try {
    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Supplier name is required"
      });
    }

    const result = await pool.query(
      `INSERT INTO suppliers
       (name, phone, email, address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        name.trim(),
        phone || null,
        email || null,
        address || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to add supplier:", error);

    res.status(500).json({
      error: "Failed to add supplier"
    });
  }
};


// UPDATE SUPPLIER
export const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;

  try {
    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Supplier name is required"
      });
    }

    const result = await pool.query(
      `UPDATE suppliers
       SET name = $1,
           phone = $2,
           email = $3,
           address = $4
       WHERE id = $5
       RETURNING *`,
      [
        name.trim(),
        phone || null,
        email || null,
        address || null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Supplier not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update supplier:", error);

    res.status(500).json({
      error: "Failed to update supplier"
    });
  }
};


// DELETE SUPPLIER
export const deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM suppliers WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Supplier not found"
      });
    }

    res.json({
      message: "Supplier deleted successfully"
    });
  } catch (error) {
    console.error("Failed to delete supplier:", error);

    res.status(500).json({
      error: "Failed to delete supplier"
    });
  }
};
