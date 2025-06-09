export const fetchCurrentStockAndProductNameByIdQuery = 'SELECT current_stock, product_name FROM products WHERE product_id = $1';
export const insertOrderQuery = `INSERT INTO orders (customer_id, order_date, total_amount, order_status) VALUES ($1, NOW(), 0, 'PENDING') RETURNING *`;
export const fetchUnitPriceByIdQuery = 'SELECT unit_price FROM products WHERE product_id = $1';
export const insertIntoOrderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, unit_price_at_order) VALUES ($1, $2, $3, $4)';
export const updateProductsCurrentStockQuery = 'UPDATE products SET current_stock = current_stock - $1 WHERE product_id = $2';
export const updateOrdersTotalAmountQuery = 'UPDATE orders SET total_amount = $1 WHERE order_id = $2';
export const fetchAllOrdersQuery = `
    SELECT o.order_id, o.order_date, o.total_amount, o.order_status, c.customer_name
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    ORDER BY o.order_date DESC
  `
export const fetchOrderByIdQuery = `SELECT o.order_id, o.order_date, o.total_amount, o.order_status, c.customer_name, c.email, p.product_name, oi.quantity, oi.unit_price_at_order
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.order_id = $1`;
export const fetchCurrentOrderStatusQuery = 'SELECT order_status FROM orders WHERE order_id = $1';
export const updateOrderStatusQuery = 'UPDATE orders SET order_status = $1 WHERE order_id = $2';
export const restoreProductCurrentStockQuery = `UPDATE products
      SET current_stock = current_stock + oi.quantity
      FROM order_items oi
      WHERE products.product_id = oi.product_id AND oi.order_id = $1`;
export const updateOrderStatusToCancelled = `UPDATE orders SET order_status = 'CANCELLED' WHERE order_id = $1`;
export const fetchProductQuanityById = `SELECT product_id, quantity FROM order_items WHERE order_id = $1`;
export const restoreDeletedProductQuantityById = `UPDATE products SET current_stock = current_stock + $1 WHERE product_id = $2`;