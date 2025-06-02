export interface Product {
    product_id: number;
    product_name: string;
    description?: string;
    unit_price: number;
    current_stock: number;
    reorder_level: number;
}
