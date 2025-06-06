export const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case "pending":
            return "warning"
        case "shipped":
            return "primary"
        case "delivered":
            return "success"
        case "cancelled":
            return "error"
        default:
            return "default"
    }
}