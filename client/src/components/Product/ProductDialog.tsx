import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
} from "@mui/material";
import React from "react";
import type { Product, ProductDialogProps } from "../../types/Product";

const ProductDialog: React.FC<ProductDialogProps> = ({
    open,
    formData,
    formErrors,
    onClose,
    onChange,
    onSubmit,
    editingProduct,
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {["product_name", "description", "unit_price", "current_stock", "reorder_level"].map((field) => (
                        <Grid key={field} size={12}>
                            <TextField
                                fullWidth
                                multiline={field === "description"}
                                rows={field === "description" ? 3 : 1}
                                label={
                                    field === "product_name"
                                        ? "Product Name"
                                        : field === "unit_price"
                                            ? "Price"
                                            : field
                                                .replace("_", " ")
                                                .replace(/\b\w/g, (l) => l.toUpperCase())
                                }
                                type={["unit_price", "current_stock", "reorder_level"].includes(field) ? "number" : "text"}
                                value={formData[field as keyof Product]}
                                onChange={(e) => onChange(field as keyof Product, e.target.value)}
                                error={!!formErrors[field]}
                                helperText={formErrors[field]}
                            />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSubmit} variant="contained">
                    {editingProduct ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductDialog;
