import {
    CurrencyRupee,
    Person as PersonIcon,
    ShoppingCart as ShoppingCartIcon,
    TrendingUp as TrendingUpIcon
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Card,
    CardContent,
    FormControl,
    Grid,
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
    Typography
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import type { CustomerOrder, CustomerReport, DailySales, ProductSales } from "../types/Report";

const ReportsPage: React.FC = () => {
    const [customers, setCustomers] = useState<CustomerReport[]>([])
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
    const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([])
    const [productSales, setProductSales] = useState<ProductSales[]>([])
    const [dailySales, setDailySales] = useState<DailySales[]>([])
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

    useEffect(() => {
        fetchCustomers()
        fetchProductSales()
        fetchDailySales()
    }, [])


    const fetchCustomers = async () => {
        try {
            const response = await fetch("api/customers");
            const data = await response.json();
            console.log("all customers: ", data.data)
            setCustomers(data.data)
        } catch {
            showSnackbar("Error fetching customers", "error")
        }
    }

    const fetchCustomerOrders = async (customerId: string) => {
        try {
            const response = await fetch(`api/reports/customer-orders/${customerId}`);
            const data = await response.json();
            console.log("individual customer order: ", data)
            setCustomerOrders(data)
        } catch (error) {
            console.error("Error fetching customer orders:", error)
        }
    }

    const fetchProductSales = async () => {
        try {
            const response = await fetch("api/reports/product-sales");
            const data = await response.json();
            setProductSales(data)
            console.log("product sales: ", data)
        } catch (error) {
            console.error("Error fetching product sales:", error)
        }
    }

    const fetchDailySales = async () => {
        try {
            const response = await fetch("api/reports/daily-sales");
            const data = await response.json();
            setDailySales(data)
            console.log("daily sales: ", data)
        } catch (error) {
            console.error("Error fetching daily sales:", error)
        }
    }

    const handleCustomerChange = (customerId: string) => {
        setSelectedCustomerId(customerId)
        if (customerId) {
            fetchCustomerOrders(customerId)
        } else {
            setCustomerOrders([])
        }
    }

    const getTotalRevenue = () => {
        return productSales?.reduce((total, product) => total + Number(product.total_revenue), 0);
    }

    const getTotalQuantitySold = () => {
        return productSales?.reduce((total, product) => total + Number(product.total_quantity_sold), 0)
    }

    const getRecentDailySales = () => {
        return dailySales?.slice(-7) // Last 7 days
    }

    const getAverageDailySales = () => {
        const recentSales = getRecentDailySales()
        if (recentSales?.length === 0) return 0
        return recentSales?.reduce((total, day) => total + Number(day.total_sales), 0) / recentSales?.length
    }

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity })
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Reports & Analytics
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <CurrencyRupee color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Revenue
                                    </Typography>
                                    <Typography variant="h5">₹{getTotalRevenue()}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <ShoppingCartIcon color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Items Sold
                                    </Typography>
                                    <Typography variant="h5">{getTotalQuantitySold()}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TrendingUpIcon color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Avg Daily Sales
                                    </Typography>
                                    <Typography variant="h5">₹{getAverageDailySales()}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <PersonIcon color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Customers
                                    </Typography>
                                    <Typography variant="h5">{customers?.length}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Customer Orders Report */}
                <Grid size={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Customer Orders Report
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Select Customer</InputLabel>
                                <Select
                                    value={selectedCustomerId}
                                    label="Select Customer"
                                    onChange={(e) => handleCustomerChange(e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>Select a customer</em>
                                    </MenuItem>
                                    {customers?.map((customer: CustomerReport) => (
                                        <MenuItem key={customer.customer_id} value={customer.customer_id}>
                                            {customer.customer_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {customerOrders?.length > 0 && (
                                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Order ID</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {customerOrders?.map((order) => (
                                                <TableRow key={order.order_id}>
                                                    <TableCell>#{order.order_id}</TableCell>
                                                    <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                                                    <TableCell>{order.order_status}</TableCell>
                                                    <TableCell>₹{order.total_amount}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {selectedCustomerId && customerOrders?.length === 0 && (
                                <Typography color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
                                    No orders found for this customer
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Product Sales Report */}
                <Grid size={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Product Sales Report
                            </Typography>
                            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell>Qty Sold</TableCell>
                                            <TableCell>Revenue</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productSales?.map((product) => (
                                            <TableRow key={product.product_id}>
                                                <TableCell>{product.product_name}</TableCell>
                                                <TableCell>{product.total_quantity_sold}</TableCell>
                                                <TableCell>₹{product.total_revenue}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Daily Sales Report */}
                <Grid size={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Daily Sales Report
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Total Sales</TableCell>
                                            <TableCell>Number of Orders</TableCell>
                                            <TableCell>Average Order Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dailySales?.map((day) => (
                                            <TableRow key={day.sales_day}>
                                                <TableCell>{new Date(day.sales_day).toLocaleDateString()}</TableCell>
                                                <TableCell>₹{day.total_sales}</TableCell>
                                                <TableCell>{day.total_orders}</TableCell>
                                                <TableCell>
                                                    ₹{day.total_orders > 0 ? (day.total_sales / day.total_orders).toFixed(2) : "0.00"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
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

export default ReportsPage
