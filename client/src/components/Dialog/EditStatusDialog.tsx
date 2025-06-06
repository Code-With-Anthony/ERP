import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, FormControl, InputLabel, MenuItem, Select
} from "@mui/material";
import React from "react";

interface Props {
    open: boolean;
    status: string;
    onClose: () => void;
    onChange: (value: string) => void;
    onSave: () => void;
}

const EditStatusDialog: React.FC<Props> = ({ open, status, onClose, onChange, onSave }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={status}
                        label="Status"
                        onChange={(e) => onChange(e.target.value)}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={onSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditStatusDialog;