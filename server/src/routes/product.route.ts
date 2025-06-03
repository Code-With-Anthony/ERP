import express from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    stockBelowReorderLevel,
    updateProduct
} from '../controllers/product.controller';

import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/product/ProductConstant';

const router = express.Router();

// GET /api/products
router.get('/', async (_, res) => {
    try {
        const products = await getAllProducts();
        res.json({
            message: SUCCESS_MESSAGES.FETCH_ALL_PRODUCTS,
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: ERROR_MESSAGES.FETCH_ALL_PRODUCTS_FAILED });
    }
});

// GET /api/products/low-stock
router.get('/low-stock', async (_, res) => {
    try {
        const lowStockProducts = await stockBelowReorderLevel();
        res.json({
            message: SUCCESS_MESSAGES.FETCH_LOW_STOCK_PRODUCTS,
            data: lowStockProducts
        });
    } catch (error) {
        res.status(500).json({ error: ERROR_MESSAGES.FETCH_LOW_STOCK_PRODUCTS_FAILED });
    }
});

// GET /api/products/:id
router.get('/:id', async (req: any, res: any) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        }
        res.json({
            message: SUCCESS_MESSAGES.FETCH_PRODUCT_BY_ID,
            data: product
        });
    } catch (error) {
        res.status(500).json({ error: ERROR_MESSAGES.FETCH_PRODUCT_BY_ID_FAILED });
    }
});

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const newProduct = await createProduct(req.body);
        res.status(201).json({
            message: SUCCESS_MESSAGES.PRODUCT_CREATED,
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({ error: ERROR_MESSAGES.PRODUCT_CREATION_FAILED });
    }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await updateProduct(req.params.id, req.body);
        res.json({
            message: SUCCESS_MESSAGES.PRODUCT_UPDATED,
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ error: ERROR_MESSAGES.PRODUCT_UPDATE_FAILED });
    }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await deleteProduct(req.params.id);
        res.json({
            message: SUCCESS_MESSAGES.PRODUCT_DELETED,
            data: deletedProduct
        });
    } catch (error) {
        res.status(500).json({ error: ERROR_MESSAGES.PRODUCT_DELETION_FAILED });
    }
});

export default router;
