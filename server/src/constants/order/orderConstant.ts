export const SUCCESS_MESSAGES = {
    ORDER_PLACED: "Order placed successfully",
    FETCH_ALL_ORDERS: "Orders fetched successfully",
    FETCH_ORDER_BY_ID: "Order details fetched successfully",
    ORDER_STATUS_UPDATED: "Order status updated successfully",
    ORDER_CANCELLED: "Order cancelled and stock restored",
};

export const ERROR_MESSAGES = {
    ORDER_PLACEMENT_FAILED: "Failed to place order",
    FETCH_ALL_ORDERS_FAILED: "Failed to fetch orders",
    FETCH_ORDER_BY_ID_FAILED: "Failed to retrieve order",
    ORDER_NOT_FOUND: "Order not found",
    INVALID_ORDER_STATUS_TRANSITION: "Invalid status transition",
    ORDER_ALREADY_CANCELLED: "Order is already cancelled",
    ORDER_STATUS_UPDATE_FAILED: "Failed to update order status",
    ORDER_CANCELLATION_FAILED: "Failed to cancel order",
    ORDER_MUST_HAVE_ITEMS: "Order must contain at least one item",
    INSUFFICIENT_STOCK: "Insufficient stock for product_id",
};
