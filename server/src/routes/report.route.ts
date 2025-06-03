import { Router } from "express";
import {
    getCustomerOrders,
    getDailySales,
    getProductSales
} from "../controllers/report.controller";

const router = Router();

router.get("/customer-orders/:customerId", getCustomerOrders);
router.get("/product-sales", getProductSales);
router.get("/daily-sales", getDailySales);

export default router;
