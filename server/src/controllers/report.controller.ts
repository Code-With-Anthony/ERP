import { Request, Response } from "express";
import pool from "../db/supabase";
import { ERROR_MESSAGES } from "../constants/report/ReportConstant";

// Get all orders for a specific customer
export const getCustomerOrders = async (req: Request, res: Response) => {
    const { customerId } = req.params;

    try {
        const sql = `
      SELECT o.*, c.customer_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      WHERE o.customer_id = $1
      ORDER BY o.order_date DESC
    `;
        const { rows } = await pool.query(sql, [customerId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: ERROR_MESSAGES.FETCH_CUSTOMER_ORDERS_FAILED, msg: error });
    }
};

// Get product sales report
export const getProductSales = async (_req: Request, res: Response) => {
    try {
        const sql = `
      SELECT 
        p.product_id,
        p.product_name,
        SUM(oi.quantity) AS total_quantity_sold,
        SUM(oi.quantity * oi.unit_price_at_order) AS total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY p.product_id, p.product_name
      ORDER BY total_revenue DESC
    `;
        const { rows } = await pool.query(sql);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: ERROR_MESSAGES.FETCH_PRODUCT_SALES_REPORT_FAILED, msg: error });
    }
};

// Get daily sales
export const getDailySales = async (_req: Request, res: Response) => {
    try {
        const sql = `
      SELECT 
        DATE_TRUNC('day', order_date) AS sales_day,
        SUM(total_amount) AS total_sales,
        COUNT(*) As total_orders
      FROM orders
      GROUP BY sales_day
      ORDER BY sales_day DESC
    `;
        const { rows } = await pool.query(sql);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: ERROR_MESSAGES.FETCH_DAILY_SALES_REPORT_FAILED, msg: error });
    }
};
