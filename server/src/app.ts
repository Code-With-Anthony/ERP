import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.route';
import customerRoutes from "./routes/customer.route";
import orderRoutes from "./routes/order.route";
import reportRoutes from "./routes/report.route";
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

export default app;
