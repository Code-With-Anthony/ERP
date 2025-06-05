import { z } from "zod";

export const customerSchema = z.object({
    customer_name: z.string().min(3, "Customer name must be at least 3 characters long"),
    email: z.string().email("Invalid email"),
    phone_number: z.string().min(10, "Phone number must be at least 10"),
    address: z.string().min(20, "Address must be at least 20 characters long"),
})

export type Customer = z.infer<typeof customerSchema>