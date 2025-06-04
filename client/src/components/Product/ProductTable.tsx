import { Delete as DeleteIcon, Edit as EditIcon, Warning as WarningIcon } from "@mui/icons-material";
import {
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import { useState } from "react";
import type { Product } from "../../types/Product";

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Reorder Level</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProducts.map((product) => (
                            <TableRow key={product.product_id}>
                                <TableCell>{product.product_name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>${product.unit_price}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={product.current_stock}
                                        color={product.current_stock <= product.reorder_level ? "error" : "default"}
                                        icon={product.current_stock <= product.reorder_level ? <WarningIcon /> : undefined}
                                    />
                                </TableCell>
                                <TableCell>{product.reorder_level}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onEdit(product)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            if (product.product_id !== undefined) {
                                                onDelete(product.product_id);
                                            }
                                        }}
                                    >
                                        <DeleteIcon sx={{ color: "#B22222" }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={products.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Paper>
    );
};

export default ProductTable;
