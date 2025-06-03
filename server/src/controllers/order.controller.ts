import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/order/orderConstant';
import pool from '../db/supabase';

export const createOrder = async (req: any, res: any) => {
    const client = await pool.connect();
    try {
        const { customer_id, items }: { customer_id: number; items: { product_id: number; quantity: number; }[] } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: ERROR_MESSAGES.ORDER_MUST_HAVE_ITEMS });
        }

        await client.query('BEGIN');

        // Check stock
        for (const item of items) {
            const stockRes = await client.query(
                'SELECT current_stock FROM products WHERE product_id = $1',
                [item.product_id]
            );
            const stock = stockRes.rows[0]?.current_stock;
            if (stock === undefined || stock < item.quantity) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: `${ERROR_MESSAGES.INSUFFICIENT_STOCK} ${item.product_id}` });
            }
        }

        // Insert order
        const orderRes = await client.query(
            `INSERT INTO orders (customer_id, order_date, total_amount, order_status) VALUES ($1, NOW(), 0, 'PENDING') RETURNING *`,
            [customer_id]
        );
        const order = orderRes.rows[0];
        let totalAmount = 0;

        // Insert order items and update stock
        for (const item of items) {
            const priceRes = await client.query('SELECT unit_price FROM products WHERE product_id = $1', [item.product_id]);
            const unit_price = priceRes.rows[0]?.unit_price;

            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price_at_order) VALUES ($1, $2, $3, $4)`, [order.order_id, item.product_id, item.quantity, unit_price]);

            await client.query(`UPDATE products SET current_stock = current_stock - $1 WHERE product_id = $2`, [item.quantity, item.product_id]);

            totalAmount += unit_price * item.quantity;
        }

        // Update total amount
        await client.query('UPDATE orders SET total_amount = $1 WHERE order_id = $2', [totalAmount, order.order_id]);

        await client.query('COMMIT');
        res.status(201).json({ message: SUCCESS_MESSAGES.ORDER_PLACED, order_id: order.order_id });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: ERROR_MESSAGES.ORDER_PLACEMENT_FAILED, error });
    } finally {
        client.release();
    }
};

export const getAllOrders = async (_req: any, res: any) => {
    try {
        const result = await pool.query(`
      SELECT o.order_id, o.order_date, o.total_amount, o.order_status, c.customer_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.order_date DESC
    `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: ERROR_MESSAGES.FETCH_ALL_ORDERS_FAILED, error });
    }
};

export const getOrderById = async (req: any, res: any) => {
    const orderId = parseInt(req.params.id);
    try {
        const result = await pool.query(`
      SELECT o.order_id, o.order_date, o.total_amount, o.order_status, c.customer_name, c.email, p.product_name, oi.quantity, oi.unit_price_at_order
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.order_id = $1
    `, [orderId]);


        if (result.rows.length === 0) {
            return res.status(404).json({ message: ERROR_MESSAGES.ORDER_NOT_FOUND });
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: ERROR_MESSAGES.FETCH_ORDER_BY_ID_FAILED, error });
    }
};

export const updateOrderStatus = async (req: any, res: any) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const validTransitions: { [key: string]: string[] } = {
        PENDING: ['SHIPPED', 'CANCELLED'],
        SHIPPED: ['DELIVERED'],
        DELIVERED: [],
        CANCELLED: []
    };

    try {
        const currentRes = await pool.query(
            'SELECT order_status FROM orders WHERE order_id = $1',
            [orderId]
        );

        if (currentRes.rows.length === 0) {
            return res.status(404).json({ message: ERROR_MESSAGES.ORDER_NOT_FOUND });
        }

        const currentStatus = currentRes.rows[0].order_status;
        if (!validTransitions[currentStatus].includes(status)) {
            return res.status(400).json({ message: `Invalid status transition from ${currentStatus} to ${status}` });
        }

        await pool.query(
            'UPDATE orders SET order_status = $1 WHERE order_id = $2',
            [status, orderId]
        );

        res.json({ message: SUCCESS_MESSAGES.ORDER_STATUS_UPDATED });
    } catch (error) {
        res.status(500).json({ message: ERROR_MESSAGES.ORDER_STATUS_UPDATE_FAILED, error });
    }
};

export const cancelOrder = async (req: any, res: any) => {
    const orderId = parseInt(req.params.id);
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Mark as cancelled
        await client.query(
            'UPDATE orders SET order_status = $1 WHERE order_id = $2',
            ['CANCELLED', orderId]
        );

        // Restore stock
        await client.query(`
      UPDATE products
      SET current_stock = current_stock + oi.quantity
      FROM order_items oi
      WHERE products.product_id = oi.product_id AND oi.order_id = $1
    `, [orderId]);

        await client.query('COMMIT');
        res.json({ message: SUCCESS_MESSAGES.ORDER_CANCELLED });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: ERROR_MESSAGES.ORDER_CANCELLATION_FAILED, error });
    } finally {
        client.release();
    }
};

export const deleteOrder = async (req: any, res: any) => {
    const orderId = parseInt(req.params.id);
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const orderRes = await client.query(
            `SELECT order_status FROM orders WHERE order_id = $1`,
            [orderId]
        );

        if (orderRes.rows.length === 0) {
            return res.status(404).json({ message: ERROR_MESSAGES.ORDER_NOT_FOUND });
        }

        if (orderRes.rows[0].order_status === "CANCELLED") {
            return res.status(400).json({ message: ERROR_MESSAGES.ORDER_ALREADY_CANCELLED });
        }

        await client.query(
            `UPDATE orders SET order_status = 'CANCELLED' WHERE order_id = $1`,
            [orderId]
        );

        const itemsRes = await client.query(
            `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
            [orderId]
        );

        for (const item of itemsRes.rows) {
            await client.query(
                `UPDATE products SET current_stock = current_stock + $1 WHERE product_id = $2`,
                [item.quantity, item.product_id]
            );
        }

        await client.query("COMMIT");
        return res.json({ message: SUCCESS_MESSAGES.ORDER_CANCELLED });
    } catch (error) {
        await client.query("ROLLBACK");
        return res.status(500).json({ message: ERROR_MESSAGES.ORDER_CANCELLATION_FAILED, error });
    } finally {
        client.release();
    }
};

