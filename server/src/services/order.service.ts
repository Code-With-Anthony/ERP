import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/order/orderConstant";
import pool from "../db/supabase";
import AppError from "../errors/myError";
import { fetchAllOrdersQuery, fetchCurrentOrderStatusQuery, fetchCurrentStockAndProductNameByIdQuery, fetchOrderByIdQuery, fetchProductQuanityById, fetchUnitPriceByIdQuery, insertIntoOrderItemsQuery, insertOrderQuery, restoreDeletedProductQuantityById, restoreProductCurrentStockQuery, updateOrderStatusQuery, updateOrderStatusToCancelled, updateOrdersTotalAmountQuery, updateProductsCurrentStockQuery } from "../models/order.model";
import { OrderItem } from "../types/orderItem";

export const createOrder = async (customerId: number, items: OrderItem[]) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Validate stock and get price
        for (const item of items) {
            const { rows: stockRows } = await client.query(fetchCurrentStockAndProductNameByIdQuery, [item.product_id]);
            const stock = stockRows[0]?.current_stock;
            const productName = stockRows[0].product_name;
            if (stock === undefined || stock < item.quantity) {
                console.log(`${ERROR_MESSAGES.INSUFFICIENT_STOCK} ${productName}`)
                await client.query('ROLLBACK');
                throw new Error(`${ERROR_MESSAGES.INSUFFICIENT_STOCK} ${productName}`)
            }
        }

        // Insert order
        const { rows: orderRows } = await client.query(insertOrderQuery, [customerId]);
        const order = orderRows[0];
        let totalAmount = 0;

        // Insert order items and update stock
        for (const item of items) {
            const priceRes = await client.query(fetchUnitPriceByIdQuery, [item.product_id]);
            const unit_price = priceRes.rows[0]?.unit_price;

            await client.query(insertIntoOrderItemsQuery, [order.order_id, item.product_id, item.quantity, unit_price]);

            await client.query(updateProductsCurrentStockQuery, [item.quantity, item.product_id]);

            totalAmount += unit_price * item.quantity;
        }

        // Update total amount
        await client.query(updateOrdersTotalAmountQuery, [totalAmount, order.order_id]);

        await client.query('COMMIT');
        return order.order_id;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error
    } finally {
        client.release();
    }
};

export const fetchAllOrders = async () => {
    const { rows } = await pool.query(fetchAllOrdersQuery);
    return rows;
};

export const fetchOrderById = async (id: number) => {
    const { rows } = await pool.query(fetchOrderByIdQuery, [id]);
    return rows;
}

export const fetchOrderStatus = async (orderId: number, status: string) => {
    const validTransitions: { [key: string]: string[] } = {
        PENDING: ['SHIPPED', 'CANCELLED'],
        SHIPPED: ['DELIVERED'],
        DELIVERED: [],
        CANCELLED: []
    };
    const newStatus = status.toUpperCase();
    try {
        const { rows: currentRes } = await pool.query(fetchCurrentOrderStatusQuery, [orderId]);

        if (currentRes[0].length === 0) {
            throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, 400);
        }

        const currentStatus = currentRes[0].order_status;
        if (!validTransitions[currentStatus].includes(newStatus)) {
            throw new AppError(`Invalid status transition from ${currentStatus} to ${newStatus}`, 400);
        }

        await pool.query(updateOrderStatusQuery, [newStatus, orderId]);

        return SUCCESS_MESSAGES.ORDER_STATUS_UPDATED;
    } catch {
        throw new AppError(ERROR_MESSAGES.ORDER_STATUS_UPDATE_FAILED, 500);
    }
}

export const cancelOrder = async (orderId: number) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Mark as cancelled
        await client.query(updateOrderStatusQuery, ['CANCELLED', orderId]);

        // Restore stock
        await client.query(restoreProductCurrentStockQuery, [orderId]);

        await client.query('COMMIT');
        return SUCCESS_MESSAGES.ORDER_CANCELLED;
    } catch (error) {
        await client.query('ROLLBACK');
        throw new AppError(ERROR_MESSAGES.ORDER_CANCELLATION_FAILED, 500);
    } finally {
        client.release();
    }
}

export const deleteOrder = async (orderId: number) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const orderRes = await client.query(fetchCurrentOrderStatusQuery, [orderId]);

        if (orderRes.rows.length === 0) {
            throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, 404);
        }

        if (orderRes.rows[0].order_status === "CANCELLED") {
            throw new AppError(ERROR_MESSAGES.ORDER_ALREADY_CANCELLED, 400);
        }

        await client.query(updateOrderStatusToCancelled, [orderId]);

        const itemsRes = await client.query(fetchProductQuanityById, [orderId]);

        for (const item of itemsRes.rows) {
            await client.query(restoreDeletedProductQuantityById, [item.quantity, item.product_id]);
        }

        await client.query("COMMIT");
        return SUCCESS_MESSAGES.ORDER_CANCELLED;
    } catch (error) {
        await client.query("ROLLBACK");
        throw new AppError(ERROR_MESSAGES.ORDER_CANCELLATION_FAILED, 500);
    } finally {
        client.release();
    }
}