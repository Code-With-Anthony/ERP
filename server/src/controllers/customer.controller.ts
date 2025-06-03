import pool from "../db/supabase";
import { Customer } from "../types/customer";

// Retrieve All Customers.
export const getAllCustomers = async (): Promise<Customer[]> => {
    const sql = `SELECT * FROM customers WHERE deleted_at IS NULL ORDER BY customer_name ASC`;
    const { rows } = await pool.query(sql);
    return rows
}

// Retrieve Customer by ID
export const getCustomerById = async (id: string): Promise<Customer | null> => {
    const sql = `SELECT * FROM customers WHERE customer_id = $1 AND deleted_at IS NULL`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
}

// Add New Customer
export const addCustomer = async (customer: Customer): Promise<Customer> => {
    const { customer_name, email, phone_number, address } = customer;
    const sql = `INSERT INTO customers (customer_name, email, phone_number, address) VALUES ($1, $2, $3, $4) RETURNING *`;
    const { rows } = await pool.query(sql, [customer_name, email, phone_number, address])
    return rows[0];
}

// Update Existing Customer
export const updateCustomer = async (id: string, customer: Customer): Promise<Customer | null> => {
    const { customer_name, email, phone_number, address } = customer;
    const sql = `UPDATE customers SET customer_name = $1, email = $2, phone_number = $3, address = $4 WHERE customer_id = $5 AND deleted_at IS NULL RETURNING *`;
    const { rows } = await pool.query(sql, [customer_name, email, phone_number, address, id])
    return rows[0] || null;
}

// Delete Customer
export const deleteCustomer = async (id: string): Promise<Customer | null> => {
    const sql = `UPDATE customers SET deleted_at = NOW() WHERE customer_id = $1 AND deleted_at IS NULL RETURNING *`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
}

// Additional Admin only routes
// 1. View deleted customers
export const getDeletedCustomers = async (): Promise<Customer[]> => {
    const sql = `SELECT * FROM customers WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC`;
    const { rows } = await pool.query(sql);
    return rows;
}

// 2. Restore customer
export const restoreCustomer = async (id: string): Promise<Customer | null> => {
    const sql = `UPDATE customers SET deleted_at = NULL WHERE customer_id = $1 RETURNING *`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
}