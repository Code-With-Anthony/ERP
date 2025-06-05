import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import React from "react";

interface TableComponentProps<T> {
    data: T[];
    columns: Array<{ label: string, key: keyof T, render?: (value: any, row: T) => React.ReactNode }>;
    actions?: (row: T) => React.ReactNode;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    rowsPerPageOptions?: number[];
    defaultRowsPerPage?: number;
}

const TableComponent = <T extends object>({
    data,
    columns,
    actions,
    onEdit,
    onDelete,
    rowsPerPageOptions = [5, 10, 25],
    defaultRowsPerPage = 5,
}: TableComponentProps<T>) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.label}>{col.label}</TableCell>
                            ))}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((col) => (
                                    <TableCell key={col.label}>
                                        {col.render ? col.render(row[col.key], row) : (row[col.key] as React.ReactNode)}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <IconButton onClick={() => onEdit(row)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => onDelete(row)}>
                                        <DeleteIcon sx={{ color: "#B22222" }} />
                                    </IconButton>
                                    {actions && actions(row)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={data.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
            />
        </Paper>
    );
};

export default TableComponent;
