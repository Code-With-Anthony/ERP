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
    Select,
    Snackbar,
    Typography
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import TableComponent from "../components/Common/Table";
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
                                    <Typography variant="h5">₹{getAverageDailySales().toFixed(2)}</Typography>
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

                            {customerOrders.length > 0 && (
                                <TableComponent
                                    data={customerOrders}
                                    columns={[
                                        { label: "Order ID", key: "order_id", render: (v) => `#${v}` },
                                        { label: "Date", key: "order_date", render: (v) => new Date(v).toLocaleDateString() },
                                        { label: "Status", key: "order_status" },
                                        { label: "Amount", key: "total_amount", render: (v) => `₹${v}` }
                                    ]}
                                />
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
                            <TableComponent
                                data={productSales}
                                columns={[
                                    { label: "Product", key: "product_name" },
                                    { label: "Qty Sold", key: "total_quantity_sold" },
                                    { label: "Revenue", key: "total_revenue", render: (v) => `₹${v}` }
                                ]}
                            />
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
                            <TableComponent
                                data={dailySales}
                                columns={[
                                    { label: "Date", key: "sales_day", render: (v) => new Date(v).toLocaleDateString() },
                                    { label: "Total Sales", key: "total_sales", render: (v) => `₹${v}` },
                                    { label: "Number of Orders", key: "total_orders" },
                                    {
                                        label: "Average Order Value",
                                        key: "total_sales",
                                        render: (_, row) =>
                                            row.total_orders > 0
                                                ? `₹${(row.total_sales / row.total_orders).toFixed(2)}`
                                                : "₹0.00"
                                    }
                                ]}
                            />
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
