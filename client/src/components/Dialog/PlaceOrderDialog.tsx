import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, Grid, Box, FormControl, InputLabel, MenuItem,
    Select, Typography, IconButton, TextField
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { OrderItem } from "../../types/Order";
import type { Customer } from "../../types/Customer";
import type { Product } from "../../types/Product";
import React from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    customers: Customer[];
    products: Product[];
    formData: { customer_id: string; items: OrderItem[] };
    setFormData: (data: any) => void;
    handleSubmit: () => void;
    addOrderItem: () => void;
    updateOrderItem: (index: number, field: string, value: any) => void;
    removeOrderItem: (index: number) => void;
    calculateTotal: () => number;
}

const PlaceOrderDialog: React.FC<Props> = ({
    open, onClose, customers, products, formData, setFormData,
    handleSubmit, addOrderItem, updateOrderItem, removeOrderItem, calculateTotal
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Place New Order</DialogTitle>
        <DialogContent>
            <Box pt={2}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <FormControl fullWidth>
                            <InputLabel>Customer</InputLabel>
                            <Select
                                value={formData.customer_id}
                                label="Customer"
                                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                            >
                                {customers.map((c) => (
                                    <MenuItem key={c.customer_id} value={c.customer_id}>
                                        {c.customer_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={12}>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="h6">Order Items</Typography>
                            <Button onClick={addOrderItem} startIcon={<AddIcon />}>Add Item</Button>
                        </Box>

                        {formData.items.map((item, index) => (
                            <Box key={index} mb={2} p={2} border="1px solid #ddd" borderRadius={1}>
                                <Grid container spacing={2}>
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
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            label="Quantity"
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateOrderItem(index, "quantity", parseInt(e.target.value))}
                                            inputProps={{ min: 1 }}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField fullWidth label="Price" value={`₹${item.price}`} disabled />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            label="Subtotal"
                                            value={`₹${(item.price * item.quantity).toFixed(2)}`}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid size={6}>
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
        <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
            <Typography variant="h6">
                Total: ₹{formData.items.length > 0 ? calculateTotal().toFixed(2) : "0.00"}
            </Typography>
            <Box>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!formData.customer_id || formData.items.length === 0}>
                    Place Order
                </Button>
            </Box>
        </DialogActions>
    </Dialog>
);

export default PlaceOrderDialog;
