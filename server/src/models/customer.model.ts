export const getAllCustomersQuery = `SELECT * FROM customers WHERE deleted_at IS NULL ORDER BY customer_name ASC`;
export const getCustomerByIdQuery = `SELECT * FROM customers WHERE customer_id = $1 AND deleted_at IS NULL`;
export const createCustomerQuery = `INSERT INTO customers (customer_name, email, phone_number, address) VALUES ($1, $2, $3, $4) RETURNING *`;
export const updateCustomerByIdQuery = `UPDATE customers SET customer_name = $1, email = $2, phone_number = $3, address = $4 WHERE customer_id = $5 AND deleted_at IS NULL RETURNING *`;
export const deleteCustomerByIdQuery = `UPDATE customers SET deleted_at = NOW() WHERE customer_id = $1 AND deleted_at IS NULL RETURNING *`;
export const viewDeletedCustomersQuery = `SELECT * FROM customers WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC`;
export const restoreDeletedCustomersQuery = `UPDATE customers SET deleted_at = NULL WHERE customer_id = $1 RETURNING *`;
