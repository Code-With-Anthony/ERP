import { NextFunction } from 'express';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/order/orderConstant';
import pool from '../db/supabase';
import * as orderService from "../services/order.service";

export const createOrder = async (req: any, res: any) => {
    try {
        const { customer_id, items }: { customer_id: number; items: { product_id: number; quantity: number; }[] } = req.body;

        if (!items || items.length === 0) {
            throw new Error(ERROR_MESSAGES.ORDER_MUST_HAVE_ITEMS);
        }
        const orderId = await orderService.createOrder(req.body.customer_id, req.body.items);
        return res.status(201).json({ message: SUCCESS_MESSAGES.ORDER_PLACED, order_id: orderId });
    } catch (error: any) {
        throw new Error(error.message)
    }
};

export const getAllOrders = async (_req: any, res: any) => {
    try {
        const orders = await orderService.fetchAllOrders();
        if (!orders) throw new Error(ERROR_MESSAGES.FETCH_ALL_ORDERS_FAILED);
        res.status(200).json({
            message: SUCCESS_MESSAGES.FETCH_ALL_ORDERS,
            data: orders,
        });
    } catch (error) {
        throw error
    }
};

export const getOrderById = async (req: any, res: any) => {
    const orderId = parseInt(req.params.id);
    try {
        const order = await orderService.fetchOrderById(orderId);

        if (order.length === 0) {
            throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
        }

        res.status(200).json({
            message: SUCCESS_MESSAGES.FETCH_ORDER_BY_ID,
            data: order,
        });
    } catch (error) {
        res.status(500).json({ message: ERROR_MESSAGES.FETCH_ORDER_BY_ID_FAILED, error });
    }
};

export const updateOrderStatus = async (req: any, res: any, next: NextFunction) => {
    const orderId = parseInt(req.params.id);
    const status = req.body.status;
    try {
        const message = await orderService.fetchOrderStatus(orderId, status);
        res.status(200).json({ message });
    } catch (error) {
        next(error)
    }
};

export const cancelOrder = async (req: any, res: any, next: NextFunction) => {
    const orderId = parseInt(req.params.id);
    try {
        const message = await orderService.cancelOrder(orderId);
        res.status(200).json({ message });
    } catch (error) {
        next(error)
    }
};

export const deleteOrder = async (req: any, res: any, next: NextFunction) => {
    const orderId = parseInt(req.params.id);
    try {
        const message = await orderService.deleteOrder(orderId);
        res.status(200).json({ message });
    } catch (error) {
        next(error);
    }
};

