import express from "express";
import { addCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from "../controllers/customer.controller";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/customer/CustomerConstant";

const router = express.Router();

// GET /customers: Retrieve all customers.
router.get("/", async (_, res) => {
    try {
        const customer = await getAllCustomers();
        res.json({
            message: SUCCESS_MESSAGES.FETCH_ALL_CUSTOMERS,
            data: customer
        })
    } catch (err) {
        res.status(500).json({
            message: ERROR_MESSAGES.FETCH_ALL_CUSTOMERS_FAILED,
            error: err
        })
    }
})

// GET /customers/:id: Retrieve a single customer by ID.
router.get("/:id", async (req: any, res: any) => {
    try {
        const customer = await getCustomerById(req.params.id)
        if (!customer) {
            return res.status(404).json({
                error: ERROR_MESSAGES.CUSTOMER_NOT_FOUND,
            })
        }
        res.json({
            message: SUCCESS_MESSAGES.FETCH_SINGLE_CUSTOMER,
            data: customer
        });
    } catch (err) {
        res.status(500).json({
            message: ERROR_MESSAGES.FETCH_SINGLE_CUSTOMER_FAILED,
            error: err
        })
    }
})

// * POST /customers: Add a new customer.
router.post("/", async (req, res) => {
    try {
        const newCustomer = await addCustomer(req.body);
        res.status(201).json({
            message: SUCCESS_MESSAGES.CUSTOMER_CREATED,
            data: newCustomer
        })
    } catch (err) {
        res.status(500).json({
            message: ERROR_MESSAGES.CUSTOMER_CREATION_FAILED,
            err: err
        })
    }
})

// * PUT /customers/:id: Update an existing customer.
router.put("/:id", async (req: any, res: any) => {
    try {
        const updatedCustomer = await updateCustomer(req.params.id, req.body);
        if (!updatedCustomer) {
            return res.status(404).json({ message: ERROR_MESSAGES.CUSTOMER_NOT_FOUND });
        }
        res.json({
            message: SUCCESS_MESSAGES.CUSTOMER_UPDATED,
            data: updatedCustomer
        });
    } catch (err) {
        res.status(500).json({
            message: ERROR_MESSAGES.CUSTOMER_UPDATE_FAILED,
            error: err
        })
    }
})

// * DELETE /customers/:id: Delete a customer.
router.delete("/:id", async (req: any, res: any) => {
    try {
        const deletedCustomer = await deleteCustomer(req?.params?.id);
        if (!deletedCustomer) {
            return res.status(404).json({
                message: ERROR_MESSAGES.CUSTOMER_DELETION_FAILED,
                error: ERROR_MESSAGES.CUSTOMER_NOT_FOUND
            });
        }
        res.json({
            message: SUCCESS_MESSAGES.CUSTOMER_DELETED,
            data: deletedCustomer
        });
    } catch (err) {
        res.status(500).json({
            message: ERROR_MESSAGES.CUSTOMER_DELETION_FAILED,
            error: err
        })
    }
})

export default router;