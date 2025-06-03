export interface Customer {
    customer_id?: number; // optional because it's usually auto-generated
    customer_name: string;
    email: string;
    phone_number?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null; // Soft Delete Functionality, default is null
}