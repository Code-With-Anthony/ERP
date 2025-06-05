import { Add as AddIcon } from "@mui/icons-material"
import {
    Alert,
    Box,
    Button,
    Snackbar,
    Typography
} from "@mui/material"
import type React from "react"
import { useEffect, useState } from "react"
import TableComponent from "../components/Common/Table"
import CustomerDialog from "../components/Dialog/CustomerDialog"
import { customerSchema } from "../schemas/customerSchema"
import type { Customer } from "../types/Customer"

const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
    const [formData, setFormData] = useState({
        customer_name: "",
        email: "",
        phone_number: "",
        address: "",
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            const response = await fetch("api/customers");
            const data = await response.json();
            setCustomers(data.data)
        } catch {
            showSnackbar("Error fetching customers", "error")
        }
    }

    const handleSubmit = async () => {
        const result = customerSchema.safeParse(formData);
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
            const customerData = {
                ...formData,
                customer_name: formData.customer_name.trim(),
                email: formData.email.toLowerCase(),
                phone_number: formData.phone_number.replace(/[^0-9]/g, ''),
            }

            const url = editingCustomer ? `/api/customers/${editingCustomer.customer_id}` : "/api/customers"
            const method = editingCustomer ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customerData),
            })

            if (response.ok) {
                showSnackbar(`Customer ${editingCustomer ? "updated" : "created"} successfully`, "success");
                fetchCustomers();
                handleCloseDialog();
                setFormErrors({});
            } else {
                throw new Error("Failed to save customer")
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
                showSnackbar("Error saving customer", "error");
                console.error(error.err)
            }
            showSnackbar("Error saving customer", "error")
        }
    }

    const handleDelete = async (customer: Customer) => {
        console.log("customer: ", customer);
        console.log("customer id: ", customer.customer_id)
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                const response = await fetch(`/api/customers/${customer.customer_id}`, { method: "DELETE" })
                if (response.ok) {
                    showSnackbar("Customer deleted successfully", "success")
                    fetchCustomers()
                } else {
                    throw new Error("Failed to delete customer")
                }
            } catch {
                showSnackbar("Error deleting customer", "error")
            }
        }
    }

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer)
        setFormData({
            customer_name: customer.customer_name,
            email: customer.email,
            phone_number: customer.phone_number,
            address: customer.address,
        })
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setEditingCustomer(null)
        setFormData({
            customer_name: "",
            email: "",
            phone_number: "",
            address: "",
        })
        setFormErrors({});
    }

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity })
    }

    const columns: { label: string; key: keyof Customer; render?: (value: any, row: Customer) => React.ReactNode }[] = [
        { label: "Name", key: "customer_name" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone_number" },
        { label: "Address", key: "address" },
    ];

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Customer Management
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                    Add Customer
                </Button>
            </Box>

            <TableComponent
                data={customers}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <CustomerDialog
                open={openDialog}
                formData={formData}
                formErrors={formErrors}
                onClose={handleCloseDialog}
                onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                onSubmit={handleSubmit}
                editingCustomer={!!editingCustomer}
            />

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

export default CustomersPage
