import { NextFunction } from "express";
import pool from "../db/supabase";
import { Product } from "../types/product";
import * as productService from "../services/product.service";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/product/ProductConstant";
import AppError from "../errors/myError";

// Retrieve all products
export const getAllProducts = async (req: any, res: any, next: NextFunction) => {
    try {
        const products = await productService.fetchAllProducts();
        res.json({
            message: SUCCESS_MESSAGES.FETCH_ALL_PRODUCTS,
            data: products
        });
    } catch (error) {
        throw new AppError(ERROR_MESSAGES.FETCH_ALL_PRODUCTS_FAILED, 500);
    }
}

// Retrieve a single product by ID.
export const getProductById = async (req: any, res: any) => {
    try {
        const customer = await productService.fetchProductById(req.params.id);
        if (!customer) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
        res.status(200).json({
            message: SUCCESS_MESSAGES.FETCH_PRODUCT_BY_ID,
            data: customer,
        })
    } catch (error) {
        throw error
    }
}

//  Add a new product.
export const createProduct = async (req: any, res: any) => {
    try {
        const newCustomer = await productService.createProduct(req.body);
        if (!newCustomer) throw new Error(ERROR_MESSAGES.PRODUCT_CREATION_FAILED)
        res.status(201).json({
            message: SUCCESS_MESSAGES.PRODUCT_CREATED,
            data: newCustomer
        })
    } catch (error) {
        throw error
    }
}

// Update an existing product.
export const updateProduct = async (req: any, res: any) => {
    try {
        const updatedCustomer = await productService.updateProduct(req.params.id, req.body);
        if (!updatedCustomer) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
        res.json({
            message: SUCCESS_MESSAGES.PRODUCT_UPDATED,
            data: updatedCustomer
        });
    } catch (error) {
        throw error
    }
}

// Delete a product
export const deleteProduct = async (req: any, res: any) => {
    try {
        const deletedCustomer = await productService.deleteProduct(req?.params?.id);
        if (!deletedCustomer) throw new Error(ERROR_MESSAGES.PRODUCT_DELETION_FAILED)
        res.json({
            message: SUCCESS_MESSAGES.PRODUCT_DELETED,
            data: deletedCustomer
        });
    } catch (error) {
        throw error
    }
}

// Retrieve Products whose current_stock is below reorder_level
export const stockBelowReorderLevel = async (req: any, res: any) => {
    try {
        const updatedCustomer = await productService.stockBelowReorderLevel();
        if (!updatedCustomer) throw new Error(ERROR_MESSAGES.FETCH_LOW_STOCK_PRODUCTS_FAILED)
        res.json({
            message: SUCCESS_MESSAGES.PRODUCT_UPDATED,
            data: updatedCustomer
        });
    } catch (error) {
        throw error
    }
}