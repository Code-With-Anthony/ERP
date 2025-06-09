import express from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    stockBelowReorderLevel,
    updateProduct
} from '../controllers/product.controller';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/low-stock', stockBelowReorderLevel);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
