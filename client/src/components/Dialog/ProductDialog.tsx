import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import type { Product, ProductDialogProps } from '../../types/Product';
import FormField from '../Common/FormField';

const ProductDialog: React.FC<ProductDialogProps> = ({
    open,
    formData,
    formErrors,
    onClose,
    onChange,
    onSubmit,
    editingProduct,
}) => {
    const handleFieldChange = (field: keyof Product, value: string) => {
        onChange(field, value);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {[
                        { label: 'Product Name', field: 'product_name', maxLength: 20 },
                        { label: 'Description', field: 'description', multiline: true, rows: 3, maxLength: 150 },
                        { label: 'Price', field: 'unit_price', type: 'number' },
                        { label: 'Current Stock', field: 'current_stock', type: 'number' },
                        { label: 'Reorder Level', field: 'reorder_level', type: 'number' },
                    ].map(({ label, field, type = 'text', multiline = false, rows = 1, maxLength }) => (
                        <FormField
                            key={field}
                            label={label}
                            value={formData[field as keyof Product] !== undefined ? String(formData[field as keyof Product]) : ''}
                            onChange={(value) => handleFieldChange(field as keyof Product, value)}
                            type={type}
                            multiline={multiline}
                            rows={rows}
                            error={!!formErrors[field]}
                            helperText={formErrors[field]}
                            maxLength={maxLength}
                        />
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSubmit} variant="contained">
                    {editingProduct ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductDialog;
