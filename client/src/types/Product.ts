export interface Product {
    product_id?: number
    product_name: string
    description: string
    unit_price: string
    current_stock: string
    reorder_level: string
}

export interface ProductDialogProps {
    open: boolean;
    formData: Product;
    formErrors: Record<string, string>;
    onClose: () => void;
    onChange: (field: keyof Product, value: string) => void;
    onSubmit: () => void;
    editingProduct: boolean;
}