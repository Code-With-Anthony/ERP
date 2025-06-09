import pool from "../db/supabase";
import { createCustomerQuery, deleteCustomerByIdQuery, getAllCustomersQuery, getCustomerByIdQuery, restoreDeletedCustomersQuery, updateCustomerByIdQuery, viewDeletedCustomersQuery } from "../models/customer.model";
import { Customer } from "../types/customer";

export const fetchAllCustomers = async (): Promise<Customer[]> => {
    const { rows } = await pool.query(getAllCustomersQuery);
    return rows
}

export const fetchCustomerById = async (id: string): Promise<Customer | null> => {
    const { rows } = await pool.query(getCustomerByIdQuery, [id]);
    return rows[0] || null;
}

export const createCustomer = async (customer: Customer): Promise<Customer> => {
    const { customer_name, email, phone_number, address } = customer;
    const { rows } = await pool.query(createCustomerQuery, [customer_name, email, phone_number, address])
    return rows[0];
}

export const updateCustomer = async (id: string, customer: Customer): Promise<Customer | null> => {
    const { customer_name, email, phone_number, address } = customer;
    const { rows } = await pool.query(updateCustomerByIdQuery, [customer_name, email, phone_number, address, id])
    return rows[0] || null;
}

export const deleteCustomer = async (id: string): Promise<Customer | null> => {
    const { rows } = await pool.query(deleteCustomerByIdQuery, [id]);
    return rows[0] || null;
}

// Additional Service to view deleted customers
export const getDeletedCustomers = async (): Promise<Customer[]> => {
    const { rows } = await pool.query(viewDeletedCustomersQuery);
    return rows;
}

// Additional service to restore deleted customers
export const restoreCustomer = async (id: string): Promise<Customer | null> => {
    const { rows } = await pool.query(restoreDeletedCustomersQuery, [id]);
    return rows[0] || null;
}