import express, { Request, Response } from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductById, stockBelowReorderLevel, updateProduct } from '../controllers/product.controller';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const product = await getAllProducts();
        res.json(product);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch products"
        });
    }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

// POST /api/products
router.post("/", async (req, res) => {
    try {
        const newProduct = await createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Failed to create product", msg: error });
    }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await updateProduct(req.params.id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
    }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await deleteProduct(req.params.id);
        res.json(deletedProduct);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }
});

// GET /api/products/low-stock
router.get("/low-stock", async (_req, res) => {
    try {
        const lowStockProducts = await stockBelowReorderLevel();
        res.json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stock report" });
    }
});

export default router;
