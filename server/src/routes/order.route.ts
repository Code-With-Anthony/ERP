import express from "express";
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
} from "../controllers/order.controller";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
