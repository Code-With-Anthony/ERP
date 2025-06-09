import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip
} from "@mui/material";
import React from "react";

interface TableComponentProps<T> {
    data: T[];
    columns: Array<{ label: string, key: keyof T, render?: (value: any, row: T) => React.ReactNode }>;
    actions?: (row: T) => React.ReactNode;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
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
    const [sortColumn, setSortColumn] = React.useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
    const hasActions = !!onEdit || !!onDelete || !!actions;

    const handleSort = (column: keyof T) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedData = React.useMemo(() => {
        if (!sortColumn) return data;
        return [...data]?.sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            // Handle null or undefined
            if (aVal == null || bVal == null) return 0;

            // Try to convert to number if possible
            const aNum = typeof aVal === 'number' ? aVal : parseFloat(String(aVal));
            const bNum = typeof bVal === 'number' ? bVal : parseFloat(String(bVal));

            const bothAreNumbers = !isNaN(aNum) && !isNaN(bNum);

            if (bothAreNumbers) {
                return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
            }

            // Check for valid dates
            const aDate = new Date(String(aVal));
            const bDate = new Date(String(bVal));
            const bothAreDates = !isNaN(aDate.getTime()) && !isNaN(bDate.getTime());

            if (bothAreDates) {
                return sortDirection === 'asc'
                    ? aDate.getTime() - bDate.getTime()
                    : bDate.getTime() - aDate.getTime();
            }

            // fallback to string comparison
            return sortDirection === 'asc'
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [data, sortColumn, sortDirection]);

    const paginatedData = sortedData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.label} align="center" sx={{ whiteSpace: 'nowrap', cursor: 'pointer', fontWeight: sortColumn === col.key ? "bold" : undefined }} onClick={() => handleSort(col.key)}>
                                    {col.label}
                                    {sortColumn === col.key ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}
                                </TableCell>
                            ))}
                            {hasActions && <TableCell align="center">Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((col) => (
                                    <TableCell key={col.label} align="center" sx={{
                                        maxWidth: col.key === "address" ? 150 : 'auto', // limit width for address
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        <Tooltip title={String(row[col.key])} arrow>
                                            <span>{col.render ? col.render(row[col.key], row) : String(row[col.key])}</span>
                                        </Tooltip>
                                    </TableCell>
                                ))}{
                                    hasActions && (
                                        <TableCell align="center">
                                            <Box display="flex" gap={1} justifyContent="center" flexWrap="nowrap">
                                                {onEdit && (
                                                    <IconButton onClick={() => onEdit(row)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                )}
                                                {onDelete && (
                                                    <IconButton onClick={() => onDelete(row)}>
                                                        <DeleteIcon sx={{ color: "#B22222" }} />
                                                    </IconButton>
                                                )}
                                                {actions && actions(row)}
                                            </Box>
                                        </TableCell>
                                    )}
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
