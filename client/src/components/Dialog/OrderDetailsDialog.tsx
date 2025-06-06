import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, Chip, Divider, Grid, Typography, Table,
    TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Box
} from "@mui/material";
import React from "react";
import type { OrderDetail } from "../../types/Order";
import { getStatusColor } from "../../utils/utils";

interface Props {
    open: boolean;
    onClose: () => void;
    orderDetails: OrderDetail[] | null;
}

const OrderDetailsDialog: React.FC<Props> = ({ open, onClose, orderDetails }) => {
    if (!orderDetails) return null;

    const order = orderDetails[0];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
                <Box pt={1}>
                    <Grid container spacing={2} mb={3}>
                        <Grid size={12}>
                            <Typography variant="h6">Order #{order.order_id}</Typography>
                            <Typography>Date: {new Date(order.order_date).toLocaleDateString()}</Typography>
                            <Box display="flex">
                                <Typography>Status:</Typography>
                                <Chip label={order.order_status} color={getStatusColor(order.order_status)} size="small" sx={{ ml: 1 }} />
                            </Box>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant="h6">Customer Information</Typography>
                            <Typography>{order.customer_name}</Typography>
                            <Typography>{order.email}</Typography>
                            <Typography>{order.phone_number}</Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>
                        Order Items
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Subtotal</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderDetails.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.product_name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>₹{item.unit_price_at_order}</TableCell>
                                        <TableCell>₹{(item.unit_price_at_order * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box mt={2} textAlign="right">
                        <Typography variant="h6">Total Amount: ₹{order.total_amount}</Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsDialog;