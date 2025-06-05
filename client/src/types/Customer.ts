export interface Customer {
    customer_id?: number
    customer_name: string
    email: string
    phone_number: string
    address: string
}

export interface CustomerDialogProps {
    open: boolean;
    formData: Customer;
    formErrors: Record<string, string>;
    onClose: () => void;
    onChange: (field: keyof Customer, value: string) => void;
    onSubmit: () => void;
    editingCustomer: boolean;
}