import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import type { Customer, CustomerDialogProps } from '../../types/Customer';
import FormField from '../Common/FormField';

const CustomerDialog: React.FC<CustomerDialogProps> = ({
    open,
    formData,
    formErrors,
    onClose,
    onChange,
    onSubmit,
    editingCustomer,
}) => {
    const handleFieldChange = (field: keyof Customer, value: string) => {
        onChange(field, value);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <Grid container spacing={2}>
                        {[
                            { label: 'Customer Name', field: 'customer_name', maxLength: 20 },
                            { label: 'Email', field: 'email', type: 'email' },
                            { label: 'Phone', field: 'phone_number' },
                            { label: 'Address', field: 'address', multiline: true, rows: 3, maxLength: 150 },
                        ].map(({ label, field, type = 'text', multiline = false, rows = 1, maxLength }) => (
                            <FormField
                                key={field}
                                label={label}
                                value={String(formData[field as keyof Customer] ?? '')}
                                onChange={(value) => handleFieldChange(field as keyof Customer, value)}
                                type={type}
                                multiline={multiline}
                                rows={rows}
                                error={!!formErrors[field]}
                                helperText={formErrors[field]}
                                maxLength={maxLength}
                            />
                        ))}
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSubmit} variant="contained">
                    {editingCustomer ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerDialog;
