import { Add as AddIcon, Visibility as ViewIcon } from "@mui/icons-material"
import {
    Alert,
    Box,
    Button,
    Chip,
    IconButton,
    Snackbar,
    Typography
} from "@mui/material"
import type React from "react"
import { useEffect, useState } from "react"
import TableComponent from "../components/Common/Table"
import EditStatusDialog from "../components/Dialog/EditStatusDialog"
import OrderDetailsDialog from "../components/Dialog/OrderDetailsDialog"
import PlaceOrderDialog from "../components/Dialog/PlaceOrderDialog"
import type { Customer } from "../types/Customer"
import type { Order, OrderDetail, OrderItem, OrderRequest } from "../types/Order"
import type { Product } from "../types/Product"
import { getStatusColor } from "../utils/utils"
import SkeletonTable from "../components/Common/SkeletonTable"

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [openDetailDialog, setOpenDetailDialog] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail[] | null>(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
    const [formData, setFormData] = useState({
        customer_id: "",
        items: [] as OrderItem[],
    })
    const [statusOrderId, setStatusOrderId] = useState<number | null>(null);
    const [newStatus, setNewStatus] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchOrders()
        fetchCustomers()
        fetchProducts()
    }, [])

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/orders");
            const data = await response.json()
            console.log("order data: ", data)
            setOrders(data)
        } catch (error) {
            showSnackbar("Error fetching orders", "error")
            console.error(error)
        }
        finally {
            setIsLoading(false);
        }
    }

    const fetchCustomers = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("api/customers");
            const data = await response.json();
            setCustomers(data.data)
        } catch (error) {
            console.error("Error fetching customers:", error)
        } finally {
            setIsLoading(false);
        }
    }

    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("api/products");
            const data = await response.json();
            setProducts(data.data)
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setIsLoading(false);
        }
    }

    const fetchOrderDetails = async (orderId: number) => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/orders/${orderId}`)
            const data = await response.json();
            console.log("order details: ", data)
            setSelectedOrder(data)
            setOpenDetailDialog(true)
        } catch (error) {
            showSnackbar("Error fetching order details", "error")
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async () => {
        try {
            const orderData: OrderRequest = {
                customer_id: Number(formData.customer_id),
                items: formData.items.map((item) => ({
                    product_id: item.product_id ?? 0,
                    quantity: item.quantity,
                })),
            }
            const url = "/api/orders"
            const method = "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            })

            if (response.ok) {
                showSnackbar(`Order created successfully`, "success");
                fetchProducts();
                fetchCustomers();
                fetchOrders();
                handleCloseDialog();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData?.message || "Failed to create order";
                throw new Error(errorMessage);
            }
        } catch (error: any) {
            if (error?.name === "ZodError") {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err: any) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
            } else {
                const message =
                    typeof error === "string"
                        ? error
                        : error instanceof Error && error.message
                            ? error.message
                            : "An unexpected error occurred";
                showSnackbar(message, "error");
            }
        }
    }

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        try {
            const url = `/api/orders/${orderId}/status`
            const method = "PUT"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                showSnackbar(`Order Status Updated successfully`, "success");
                fetchProducts();
                fetchCustomers();
                fetchOrders();
                handleCloseDialog();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData?.message || "Failed to update status";
                throw new Error(errorMessage);
            }
        } catch (error) {
            const message =
                typeof error === "string"
                    ? error
                    : (error instanceof Error && error.message)
                        ? error.message
                        : "An unexpected error occurred";
            showSnackbar(message, "error");
        }
    }

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                const response = await fetch(`api/orders/${id}`, { method: "DELETE" });
                if (response.ok) {
                    showSnackbar("Order deleted successfully", "success")
                    fetchOrders();
                } else {
                    const errorData = await response.json();
                    const errorMessage = errorData?.message || "Failed to delete order";
                    throw new Error(errorMessage);
                }
                const updatedOrders = orders.filter((o) => o.order_id !== id)
                setOrders(updatedOrders)
                showSnackbar("Order cancelled successfully", "success")
            } catch (error) {
                const message =
                    typeof error === "string"
                        ? error
                        : error instanceof Error && error.message
                            ? error.message
                            : "Error deleting order";
                showSnackbar(message, "error");
            }
        }
    }

    const addOrderItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { product_id: 0, product_name: "", quantity: 1, price: 0 }],
        })
    }

    const updateOrderItem = (index: number, field: string, value: any) => {
        const updatedItems = [...formData.items]
        if (field === "product_id") {
            const product = products.find((p) => p.product_id === value)
            if (product) {
                updatedItems[index] = {
                    ...updatedItems[index],
                    product_id: value,
                    product_name: product.product_name,
                    price: Number(product.unit_price),
                }
            }
        } else {
            updatedItems[index] = { ...updatedItems[index], [field]: value }
        }
        setFormData({ ...formData, items: updatedItems })
    }

    const removeOrderItem = (index: number) => {
        const updatedItems = formData.items.filter((_, i) => i !== index)
        setFormData({ ...formData, items: updatedItems })
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setFormData({
            customer_id: "",
            items: [],
        })
    }

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity })
    }

    const calculateTotal = () => {
        return formData.items.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Order Management
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                    Place Order
                </Button>
            </Box>

            {/* Order Details Table */}
            {
                isLoading ? (
                    <SkeletonTable rows={5} columns={6} />
                ) : (
                    <TableComponent
                        data={orders}
                        columns={[
                            { label: "Order ID", key: "order_id", render: (v) => `#${v}` },
                            { label: "Customer", key: "customer_name" },
                            {
                                label: "Date", key: "order_date", render: (v) =>
                                    new Date(v).toLocaleDateString()
                            },
                            {
                                label: "Status", key: "order_status", render: (v) => (
                                    <Chip
                                        label={v.charAt(0).toUpperCase() + v.slice(1)}
                                        color={getStatusColor(v)}
                                        variant="outlined"
                                        sx={{ textTransform: "capitalize", fontWeight: "bold", padding: "5px 12px", borderRadius: 3 }}
                                    />
                                )
                            },
                            {
                                label: "Total Amount", key: "total_amount", render: (v) => `₹${v}`
                            }
                        ]}
                        onEdit={(row) => {
                            setOpenEditDialog(true);
                            setStatusOrderId(row.order_id ?? 0);
                            setNewStatus(row.order_status.toLowerCase());
                        }}
                        onDelete={(row) => handleDelete(row.order_id ?? 0)}
                        actions={(row) => (
                            <IconButton onClick={() => fetchOrderDetails(row.order_id ?? 0)}>
                                <ViewIcon />
                            </IconButton>
                        )}
                    />
                )
            }


            {/* Place Order Dialog */}
            <PlaceOrderDialog addOrderItem={addOrderItem} calculateTotal={calculateTotal} customers={customers} formData={formData} handleSubmit={handleSubmit} onClose={handleCloseDialog} open={openDialog} products={products} removeOrderItem={removeOrderItem} setFormData={setFormData} updateOrderItem={updateOrderItem} />

            {/* Order Details Dialog */}
            <OrderDetailsDialog
                open={openDetailDialog}
                onClose={() => setOpenDetailDialog(false)}
                orderDetails={selectedOrder}
            />

            {/* Edit Status Dialog */}
            <EditStatusDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                status={newStatus}
                onChange={setNewStatus}
                onSave={() => {
                    if (statusOrderId !== null) handleStatusUpdate(statusOrderId, newStatus);
                    setOpenEditDialog(false);
                }}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default OrdersPage
