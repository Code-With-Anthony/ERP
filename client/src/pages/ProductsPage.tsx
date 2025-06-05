import { Add as AddIcon } from "@mui/icons-material"
import {
    Alert,
    Box,
    Button,
    Snackbar,
    Typography
} from "@mui/material"
import { useEffect, useState } from "react"
import TableComponent from "../components/Common/Table"
import ProductDialog from "../components/Dialog/ProductDialog"
import { productSchema } from "../schemas/productSchema"
import type { Product } from "../types/Product"

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
    const [formData, setFormData] = useState({
        product_name: "",
        description: "",
        unit_price: "",
        current_stock: "",
        reorder_level: "",
    })
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        fetchProducts()
        fetchLowStockProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products")
            const data = await response.json()
            setProducts(data.data)
            console.log(data)
        } catch {
            showSnackbar("Error fetching products", "error")
        }
    }

    const fetchLowStockProducts = async () => {
        try {
            const response = await fetch("/api/products/low-stock")
            const data = await response.json()
            console.log("low stock data: ", data)
            setLowStockProducts(data.data)
        } catch (error) {
            console.error("Error fetching low stock products:", error)
        }
    }

    const handleSubmit = async () => {
        const result = productSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0]] = err.message;
                }
            });
            setFormErrors(fieldErrors);
            return;
        }
        try {
            const productData = {
                ...formData,
                unit_price: Number.parseFloat(result.data.unit_price),
                current_stock: Number.parseInt(result.data.current_stock),
                reorder_level: Number.parseInt(result.data.reorder_level),
            }

            const url = editingProduct ? `/api/products/${editingProduct.product_id}` : "/api/products"
            const method = editingProduct ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            })
            console.log("response: ", response);

            if (response.ok) {
                showSnackbar(`Product ${editingProduct ? "updated" : "created"} successfully`, "success");
                fetchProducts();
                fetchLowStockProducts();
                handleCloseDialog();
                setFormErrors({});
            } else {
                throw new Error("Failed to save product")
            }
        } catch (error: any) {
            if (error?.name === "ZodError") {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err: any) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
                setFormErrors(fieldErrors);
            } else {
                showSnackbar("Error saving product", "error");
            }
        }
    }

    const handleDelete = async (product: Product) => {
        const productId = product.product_id;
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`/api/products/${productId}`, { method: "DELETE" })
                if (response.ok) {
                    showSnackbar("Product deleted successfully", "success")
                    fetchProducts()
                    fetchLowStockProducts()
                } else {
                    throw new Error("Failed to delete product")
                }
            } catch {
                showSnackbar("Error deleting product", "error")
            }
        }
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setFormData({
            product_name: product.product_name,
            description: product.description,
            unit_price: product.unit_price?.toString(),
            current_stock: product?.current_stock?.toString(),
            reorder_level: product?.reorder_level?.toString(),
        })
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setEditingProduct(null)
        setFormData({
            product_name: "",
            description: "",
            unit_price: "",
            current_stock: "",
            reorder_level: "",
        })
        setFormErrors({});
    }

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity })
    }

    const columns: { label: string; key: keyof Product; render?: (value: any, row: Product) => React.ReactNode }[] = [
        { label: "Name", key: "product_name" },
        { label: "Description", key: "description" },
        { label: "Price", key: "unit_price", render: (value) => `₹${value}` },
        { label: "Stock", key: "current_stock" },
        { label: "Reorder Level", key: "reorder_level" },
    ];

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Products Management
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                    Add Product
                </Button>
            </Box>

            {lowStockProducts.length > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Low Stock Alert
                    </Typography>
                    {lowStockProducts.map((product) => (
                        <Typography key={product.product_id} variant="body2">
                            {product.product_name} - Current Stock: {product.current_stock}, Reorder Level: {product.reorder_level}
                        </Typography>
                    ))}
                </Alert>
            )}

            <TableComponent
                data={products}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getRowId={(product) => product.product_id ?? ""}
            />

            <ProductDialog
                open={openDialog}
                formData={formData}
                formErrors={formErrors}
                onClose={handleCloseDialog}
                onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                onSubmit={handleSubmit}
                editingProduct={!!editingProduct}
            />

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default ProductsPage
