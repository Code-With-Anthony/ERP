import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/customer/CustomerConstant";
import * as customerService from "../services/customer.service";

// Retrieve All Customers.
export const getAllCustomers = async (req: any, res: any) => {
    try {
        const customers = await customerService.fetchAllCustomers();
        if (!customers) throw new Error(ERROR_MESSAGES.FETCH_ALL_CUSTOMERS_FAILED)
        res.status(200).json({
            message: SUCCESS_MESSAGES.FETCH_ALL_CUSTOMERS,
            data: customers,
        });
    } catch (error) {
        throw error;
    }
};

// Retrieve Customer by ID
export const getCustomerById = async (req: any, res: any) => {
    try {
        const customer = await customerService.fetchCustomerById(req.params.id);
        if (!customer) throw new Error(ERROR_MESSAGES.CUSTOMER_NOT_FOUND)
        res.status(200).json({
            message: SUCCESS_MESSAGES.FETCH_SINGLE_CUSTOMER,
            data: customer,
        })
    } catch (error) {
        throw error
    }
}

// Add New Customer
export const addCustomer = async (req: any, res: any) => {
    try {
        const newCustomer = await customerService.createCustomer(req.body);
        if (!newCustomer) throw new Error(ERROR_MESSAGES.CUSTOMER_CREATION_FAILED)
        res.status(201).json({
            message: SUCCESS_MESSAGES.CUSTOMER_CREATED,
            data: newCustomer
        })
    } catch (error) {
        throw error
    }
}

// Update Existing Customer
export const updateCustomer = async (req: any, res: any) => {
    try {
        const updatedCustomer = await customerService.updateCustomer(req.params.id, req.body);
        if (!updatedCustomer) throw new Error(ERROR_MESSAGES.CUSTOMER_NOT_FOUND)
        res.json({
            message: SUCCESS_MESSAGES.CUSTOMER_UPDATED,
            data: updatedCustomer
        });
    } catch (error) {
        throw error
    }
}

// Delete Customer
export const deleteCustomer = async (req: any, res: any) => {
    try {
        const deletedCustomer = await customerService.deleteCustomer(req?.params?.id);
        if (!deletedCustomer) throw new Error(ERROR_MESSAGES.CUSTOMER_DELETION_FAILED)
        res.json({
            message: SUCCESS_MESSAGES.CUSTOMER_DELETED,
            data: deletedCustomer
        });
    } catch (error) {
        throw error
    }
}