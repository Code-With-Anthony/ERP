export interface CustomerOrder {
    order_id: number
    order_date: string
    order_status: string
    total_amount: number
}

export interface ProductSales {
    product_id: number
    product_name: string
    total_quantity_sold: number
    total_revenue: number
}

export interface DailySales {
    sales_day: string
    total_sales: number
    total_orders: number
}

export interface CustomerReport {
    customer_id: string;
    customer_name: string
}