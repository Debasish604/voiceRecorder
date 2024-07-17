import { useState, useEffect } from 'react';
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
import { apiService } from '../../service/api-service';

const columns = [

    { id: 'kpiname', label: 'Kpi Name', minWidth: 170 },
    {
        id: 'BenchmarkValue',
        label: 'Benchmark Value',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    }

];

function createData(id, kpiId, kpiname, BenchmarkValue) {
    return { id, kpiId, kpiname, BenchmarkValue };
}



const BenchmarkValueUpd = () => {

    const [loading, setLoading] = useState(false);
    const [isSidebar, setIsSidebar] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingRow, setEditingRow] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [rows, setRows] = useState([])

    const benchmarkShow = async () => {
        try {
            setLoading(true);
            const response = await apiService.benchmarkShow();

            if (response.status === 'Success') {
                const apiRows = response.client.map((item, index) =>
                    // createData(index, item.KPI_ID, item.KPI_NAME, item.BENCHMARK_VALUE !== null ? item.BENCHMARK_VALUE : 0)
                    createData(index, item.KPI_ID, item.KPI_NAME, item.BENCHMARK_VALUE)
                );

                setRows(apiRows);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        benchmarkShow();
    }, []);

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


    const handleSaveModalClick = async () => {
        try {
            setLoading(true);
    
            // Call the benchmarkUpdate API with KPI ID and updated Benchmark Value
            await apiService.benchmarkUpdate(editingRow.kpiId, editingRow.BenchmarkValue);
    
            // Update the local state or refetch the data to reflect the changes
            benchmarkShow();
        } catch (error) {
            console.error('Error updating benchmark value:', error);
        } finally {
            setLoading(false);
            setEditModalOpen(false);
        }
    };
    
    const handleCancelModalClick = () => {
        setEditModalOpen(false);
    };

    const handleInputChange = (event, columnId) => {
        const value = event.target.value;

        // Only update Benchmark Value, not Kpi Name
        if (columnId === 'BenchmarkValue') {
            setEditingRow((prevEditingRow) => ({
                ...prevEditingRow,
                [columnId]: value,
            }));
        }
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

                        <Header title="Benchamrk Value Update" />

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
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
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

export default BenchmarkValueUpd;
