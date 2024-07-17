import { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper, TextField } from '@mui/material';
import Header from "../../components/Header";
import SimpleBackdrop from "../../scenes/global/Loader";
import Topbar from "../components/topbar";
import Sidebar from "../components/sidebar";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

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
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
    createData('Australia', 'AU', 25475400, 7692024),
    createData('Germany', 'DE', 83019200, 357578),
    createData('Ireland', 'IE', 4857000, 70273),
    createData('Mexico', 'MX', 126577691, 1972550),
    createData('Japan', 'JP', 126317000, 377973),
    createData('France', 'FR', 67022000, 640679),
    createData('United Kingdom', 'GB', 67545757, 242495),
    createData('Russia', 'RU', 146793744, 17098246),
    createData('Nigeria', 'NG', 200962417, 923768),
    createData('Brazil', 'BR', 210147125, 8515767),
];

const UserAccess = () => {
    const [loading, setLoading] = useState(false);
    const [isSidebar, setIsSidebar] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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

    //For search

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

    const filteredRows = rows.filter((row) =>
        Object.values(row).some(
            (value) =>
                typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Box m="20px">
                    <Box display="flex" justifyContent="space-between" alignItems="center">


                        {/* For search */}

                        <Header title="User Access" />

                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Box>

                    <Box>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 400 }} >
                                <Table stickyHeader aria-label="sticky table" >
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
                                        {filteredRows
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
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
                                                            <Button style={{ backgroundColor: 'lightblue' }} onClick={() => handleEditClick(row)}>Edit</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={filteredRows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
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

export default UserAccess;
