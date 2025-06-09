import pool from "../db/supabase";
import { createNewProductQuery, deleteProductQuery, fetchAllProductsQuery, fetchProductByIdQuery, fetchStockBelowReorderLevel, updateProductByIdQuery } from "../models/product.model";
import { Product } from "../types/product";

export const fetchAllProducts = async (): Promise<Product[]> => {
    const { rows } = await pool.query(fetchAllProductsQuery);
    return rows;
}

export const fetchProductById = async (id: string): Promise<Product | null> => {
    const { rows } = await pool.query(fetchProductByIdQuery, [id]);
    return rows[0] || null;
}

export const createProduct = async (product: Product): Promise<Product> => {
    const { product_name, description, unit_price, current_stock, reorder_level } = product;
    const { rows } = await pool.query(createNewProductQuery, [product_name, description || null, unit_price, current_stock, reorder_level]);
    return rows[0];
}

export const updateProduct = async (id: string, product: Product): Promise<Product> => {
    const { product_name, description, unit_price, current_stock, reorder_level } = product;
    const { rows } = await pool.query(updateProductByIdQuery, [product_name, description || null, unit_price, current_stock, reorder_level, id]);
    return rows[0];
}

export const deleteProduct = async (id: string): Promise<Product> => {
    const { rows } = await pool.query(deleteProductQuery, [id]);
    return rows[0];
}

export const stockBelowReorderLevel = async (): Promise<Product[]> => {
    const { rows } = await pool.query(fetchStockBelowReorderLevel);
    return rows;
}