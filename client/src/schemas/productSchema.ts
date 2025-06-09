import { z } from "zod";

export const productSchema = z.object({
    product_name: z.string().trim().min(3, "Product name must be atleast 3 characters long"),
    description: z.string().trim().min(10, "Product description must be atleast 10 characters long"),
    unit_price: z.string().refine(
        val => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= 1;
        },
        { message: "Product price cannot be less then 1" }
    ),
    current_stock: z.string().refine(val => parseInt(val) > 0, {
        message: "Current stock cannot less then 1",
    }),
    reorder_level: z.string().refine(val => parseInt(val) > 0, {
        message: "Reorder level must be greater than 1",
    }),
});

export type ProductFormData = z.infer<typeof productSchema>;
