export interface Order {
    order_id?: number
    customer_id: number
    customer_name: string
    order_date: string
    order_status: string
    total_amount: number
}

export interface OrderDetail {
    order_id?: number
    customer_id: number
    product_name: string
    quantity: number
    unit_price_at_order: number
    customer_name: string
    email: string
    customer_phone: string
    phone_number: string
    order_date: string
    order_status: string
    total_amount: number
}

export interface OrderItem {
    product_id?: number
    product_name: string
    quantity: number
    price: number
}

export interface OrderRequest {
    customer_id: number
    items: {
        product_id: number
        quantity: number
    }[]
}