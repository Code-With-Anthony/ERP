export const fetchAllProductsQuery = `SELECT * FROM products WHERE deleted_at IS NULL ORDER BY product_name ASC`;
export const fetchProductByIdQuery = `SELECT * FROM products WHERE product_id = $1 AND deleted_at IS NULL`;
export const createNewProductQuery = `INSERT INTO products (product_name, description, unit_price, current_stock, reorder_level) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
export const updateProductByIdQuery = `UPDATE products SET product_name = $1, description = $2, unit_price = $3, current_stock = $4, reorder_level = $5 WHERE product_id = $6 AND deleted_at IS NULL RETURNING *`;
export const deleteProductQuery = `UPDATE products SET deleted_at = NOW() WHERE product_id = $1 RETURNING *`;
export const fetchStockBelowReorderLevel = `SELECT * FROM products WHERE current_stock < reorder_level AND deleted_at IS NULL`;