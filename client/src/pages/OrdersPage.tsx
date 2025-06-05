import { Add as AddIcon, Delete as DeleteIcon, Edit, Visibility as ViewIcon } from "@mui/icons-material"
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material"
import type React from "react"
import { useEffect, useState } from "react"
import type { Customer } from "../types/Customer"
import type { Order, OrderDetail, OrderItem, OrderRequest } from "../types/Order"
import type { Product } from "../types/Product"

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

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    useEffect(() => {
        fetchOrders()
        fetchCustomers()
        fetchProducts()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/orders");
            const data = await response.json()
            console.log("order data: ", data)
            setOrders(data)
        } catch (error) {
            showSnackbar("Error fetching orders", "error")
            console.error(error)
        }
    }

    const fetchCustomers = async () => {
        try {
            const response = await fetch("api/customers");
            const data = await response.json();
            setCustomers(data.data)
        } catch (error) {
            console.error("Error fetching customers:", error)
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await fetch("api/products");
            const data = await response.json();
            setProducts(data.data)
        } catch (error) {
            console.error("Error fetching products:", error)
        }
    }

    const fetchOrderDetails = async (orderId: number) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`)
            const data = await response.json();
            console.log("order details: ", data)
            setSelectedOrder(data)
            setOpenDetailDialog(true)
        } catch (error) {
            showSnackbar("Error fetching order details", "error")
            console.error(error)
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
                // setFormErrors(fieldErrors);
            } else {
                showSnackbar("Failed to place order", "error");
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
            showSnackbar("Error updating order status", "error")
            console.error(error)
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
                    throw new Error("Failed to delete order")
                }
                const updatedOrders = orders.filter((o) => o.order_id !== id)
                setOrders(updatedOrders)
                showSnackbar("Order cancelled successfully", "success")
            } catch (error) {
                showSnackbar("Error cancelling order", "error")
                console.error(error)
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

    const getStatusColor = (status: string) => {
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

            {isMobile ? (
                <Grid container spacing={2}>
                    {orders?.map((order) => (
                        <Grid size={12} key={order.order_id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                        <Typography variant="h6" component="h2">
                                            Order #{order.order_id}
                                        </Typography>
                                        <Box>
                                            <IconButton size="small" onClick={() => fetchOrderDetails(order.order_id)}>
                                                <ViewIcon />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(order.order_id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Customer: {order.customer_name}
                                    </Typography>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        ${order.total_amount}
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                                        <Chip label={order.order_status} color={getStatusColor(order.order_status) as any} size="small" />
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(order.order_date).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Update Status</InputLabel>
                                            <Select
                                                value={order?.order_status?.toLocaleLowerCase()}
                                                label="Update Status"
                                                onChange={(e) => handleStatusUpdate(order.order_id, e.target.value)}
                                            >
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="shipped">Shipped</MenuItem>
                                                <MenuItem value="delivered">Delivered</MenuItem>
                                                <MenuItem value="cancelled">Cancelled</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders?.map((order) => (
                                <TableRow key={order?.order_id}>
                                    <TableCell>#{order?.order_id}</TableCell>
                                    <TableCell>{order?.customer_name}</TableCell>
                                    <TableCell>{new Date(order?.order_date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            variant="outlined"
                                            label={order?.order_status.charAt(0).toUpperCase() + order?.order_status.slice(1)}
                                            color={getStatusColor(order?.order_status.toLowerCase())}
                                            sx={{
                                                textTransform: "capitalize",
                                                fontWeight: "bold",
                                                padding: "5px 12px",
                                                borderRadius: 3
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>₹{order?.total_amount}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => fetchOrderDetails(order?.order_id)}>
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(order?.order_id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton onClick={() => {
                                            setOpenEditDialog(true)
                                            setStatusOrderId(order.order_id);
                                            setNewStatus(order?.order_status.toLocaleLowerCase());
                                        }}>
                                            <Edit />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Place Order Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth disablePortal={false}>
                <DialogTitle>Place New Order</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Customer</InputLabel>
                                    <Select
                                        value={formData.customer_id}
                                        label="Customer"
                                        onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                                    >
                                        {customers.map((customer) => (
                                            <MenuItem key={customer.customer_id} value={customer.customer_id}>
                                                {customer.customer_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography variant="h6">Order Items</Typography>
                                    <Button onClick={addOrderItem} startIcon={<AddIcon />}>
                                        Add Item
                                    </Button>
                                </Box>

                                {formData.items.map((item, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid size={12}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Product</InputLabel>
                                                    <Select
                                                        value={item.product_id}
                                                        label="Product"
                                                        onChange={(e) => updateOrderItem(index, "product_id", e.target.value)}
                                                    >
                                                        {products.map((product) => (
                                                            <MenuItem key={product.product_id} value={product.product_id}>
                                                                {product.product_name} (Stock: {product.current_stock})
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid size={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Quantity"
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateOrderItem(index, "quantity", Number.parseInt(e.target.value))}
                                                    inputProps={{ min: 1 }}
                                                />
                                            </Grid>
                                            <Grid size={12}>
                                                <TextField fullWidth label="Price" value={`$${item.price}`} disabled />
                                            </Grid>
                                            <Grid size={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Subtotal"
                                                    value={`$${(item.price * item.quantity).toFixed(2)}`}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid size={12} >
                                                <IconButton onClick={() => removeOrderItem(index)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}

                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
                    <Typography variant="h6">
                        Total: ₹{formData.items.length > 0 ? calculateTotal().toFixed(2) : "0.00"}
                    </Typography>
                    <Box>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={!formData.customer_id || formData.items.length === 0}
                        >
                            Place Order
                        </Button>
                    </Box>
                </DialogActions>

            </Dialog>

            {/* Order Details Dialog */}
            <Dialog
                open={openDetailDialog}
                onClose={() => setOpenDetailDialog(false)}
                maxWidth="md"
                fullWidth
                disablePortal={false}
            >
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box sx={{ pt: 1 }}>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid size={12}>
                                    <Typography variant="h6">Order #{selectedOrder[0].order_id}</Typography>
                                    <Typography>Date: {new Date(selectedOrder[0].order_date).toLocaleDateString()}</Typography>
                                    <Box sx={{ display: "flex" }}>
                                        <Typography>
                                            Status:
                                        </Typography>
                                        <Chip
                                            label={selectedOrder[0].order_status}
                                            color={getStatusColor(selectedOrder[0].order_status) as any}
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant="h6">Customer Information</Typography>
                                    <Typography>{selectedOrder[0].customer_name}</Typography>
                                    <Typography>{selectedOrder[0].email}</Typography>
                                    <Typography>{selectedOrder[0].phone_number}</Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom>
                                Order Items
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Subtotal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder?.map((item: OrderDetail, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{item?.product_name}</TableCell>
                                                <TableCell>{item?.quantity}</TableCell>
                                                <TableCell>${item?.unit_price_at_order}</TableCell>
                                                <TableCell>${((item?.unit_price_at_order) * item?.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ mt: 2, textAlign: "right" }}>
                                <Typography variant="h6">Total Amount: ${selectedOrder[0].total_amount}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetailDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Status Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={newStatus}
                            label="Status"
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (statusOrderId !== null) {
                                handleStatusUpdate(statusOrderId, newStatus);
                            }
                            setOpenEditDialog(false);
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


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
