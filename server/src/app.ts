import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.route';
import customerRoutes from "./routes/customer.route";
import orderRoutes from "./routes/order.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

export default app;
