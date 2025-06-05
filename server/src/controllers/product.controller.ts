import pool from "../db/supabase";
import { Product } from "../types/product";

// Retrieve all products
export const getAllProducts = async (): Promise<Product[]> => {
    const sql = `SELECT * FROM products WHERE deleted_at IS NULL ORDER BY product_name ASC`;
    const { rows } = await pool.query(sql);
    return rows;
}

// Retrieve a single product by ID.
export const getProductById = async (id: string): Promise<Product | null> => {
    const sql = `SELECT * FROM products WHERE product_id = $1 AND deleted_at IS NULL`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
}

//  Add a new product.
export const createProduct = async (product: Product): Promise<Product> => {
    const { product_name, description, unit_price, current_stock, reorder_level } = product;
    const sql = `INSERT INTO products (product_name, description, unit_price, current_stock, reorder_level) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const { rows } = await pool.query(sql, [product_name, description || null, unit_price, current_stock, reorder_level]);
    return rows[0];
}

// Update an existing product.
export const updateProduct = async (id: string, product: Product): Promise<Product> => {
    const { product_name, description, unit_price, current_stock, reorder_level } = product;
    const sql = `UPDATE products SET product_name = $1, description = $2, unit_price = $3, current_stock = $4, reorder_level = $5 WHERE product_id = $6 AND deleted_at IS NULL RETURNING *`;
    const { rows } = await pool.query(sql, [product_name, description || null, unit_price, current_stock, reorder_level, id]);
    return rows[0];
}

// Delete a product
export const deleteProduct = async (id: string): Promise<Product> => {
    const sql = `UPDATE products SET deleted_at = NOW() WHERE product_id = $1 RETURNING *`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0];
}

// Retrieve Products whose current_stock is below reorder_level
export const stockBelowReorderLevel = async (): Promise<Product[]> => {
    const sql = `SELECT * FROM products WHERE current_stock < reorder_level AND deleted_at IS NULL`;
    const { rows } = await pool.query(sql);
    return rows;
}