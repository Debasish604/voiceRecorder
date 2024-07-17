import { Box, Button, Paper, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Header from "../../components/Header";
import { useState } from 'react';
import SimpleBackdrop from "../../scenes/global/Loader";
import Topbar from "../components/topbar";
import Sidebar from "../components/sidebar";

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
    {
        id: 'population',
        label: 'Population',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'size',
        label: 'Size\u00a0(km\u00b2)',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'density',
        label: 'Density',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
];

function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
}

const initialRows = [
    createData('India', 'IN', 1324171354, 3287263),
];

const DatabaseConfig = () => {
    const [loading, setLoading] = useState(false);
    const [isSidebar, setIsSidebar] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState(initialRows);
    const [editingRow, setEditingRow] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEditClick = (row) => {
        setEditingRow(row);
        setEditModalOpen(true);
    };

    const handleSaveModalClick = () => {
        setRows((prevRows) =>
            prevRows.map((prevRow) =>
                prevRow.code === editingRow.code ? editingRow : prevRow
            )
        );
        setEditModalOpen(false);
    };

    const handleCancelModalClick = () => {
        setEditModalOpen(false);
    };

    const handleInputChange = (event, columnId) => {
        const value = event.target.value;

        setEditingRow((prevEditingRow) => ({
            ...prevEditingRow,
            [columnId]: value,
        }));
    };

    return (
        <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Box m="20px">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Header title="Database Configuration" />
                    </Box>

                    <Box>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 400 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: 'lightblue' }}>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {rows
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell>
                                                        <Button style={{ backgroundColor: 'lightblue'}} onClick={() => handleEditClick(row)}>Edit</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                    <SimpleBackdrop open={loading} handleClose={() => { }} size={80} />
                </Box>

                {/* Modal for Editing */}
                <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                    <DialogTitle>Edit Row</DialogTitle>
                    <DialogContent>
                        {editingRow && (
                            <Box>
                                {columns.map((column) => (
                                    <TextField
                                        key={column.id}
                                        label={column.label}
                                        value={editingRow[column.id]}
                                        onChange={(e) => handleInputChange(e, column.id)}
                                        fullWidth
                                        margin="normal"
                                    />
                                ))}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelModalClick}>Cancel</Button>
                        <Button onClick={handleSaveModalClick}>Save</Button>
                    </DialogActions>
                </Dialog>
            </main>
        </div>
    );
};

export default DatabaseConfig;
