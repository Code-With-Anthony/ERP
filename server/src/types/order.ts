export interface Order {
    order_id?: number; // Auto-generated by DB
    customer_id: number;
    order_date?: string;
    order_status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    total_amount: number;
}