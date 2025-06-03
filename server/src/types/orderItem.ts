export interface OrderItem {
    order_item_id?: number;
    order_id: number;
    product_id: number;
    quantity: number;
    unit_price_at_order: number;
}