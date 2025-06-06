import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import React from "react";

const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ rows = 5, columns = 6 }) => {
    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {Array.from({ length: columns }).map((_, i) => (
                                <TableCell key={i}>
                                    <Skeleton variant="text" width={100} />
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIdx) => (
                            <TableRow key={rowIdx}>
                                {Array.from({ length: columns }).map((_, colIdx) => (
                                    <TableCell key={colIdx}>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default SkeletonTable;
