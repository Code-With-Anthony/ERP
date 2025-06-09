import express from "express";
import { addCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from "../controllers/customer.controller";

const router = express.Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.post("/", addCustomer)
router.put("/:id", updateCustomer)
router.delete("/:id", deleteCustomer)

export default router;