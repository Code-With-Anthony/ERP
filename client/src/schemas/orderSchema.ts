import { z } from "zod";

const orderItemSchema = z.object({
    product_id: z.number().int().nonnegative(),
    quantity: z.number().int().positive(),
});

export const orderRequestSchema = z.object({
    customer_id: z.number().int().positive(),
    items: z.array(orderItemSchema).nonempty("At least one item is required"),
});

export const orderStatusSchema = z.object({
    status: z.enum(['pending', 'shipped', 'delivered', 'cancelled'])
});

// TypeScript types inferred from schemas
export type OrderItem = z.infer<typeof orderItemSchema>;

export type OrderRequest = z.infer<typeof orderRequestSchema>;

export type OrderStatusUpdate = z.infer<typeof orderStatusSchema>;
