// import React from 'react';
// import { Paper, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
// import '../../../style/Table.css';
// import { tokens } from "../../../theme";
// const CompanyWiseTotalInvoiceAmount = ({ table_data }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   return (
//     <div>
//       <label>Company Wise Total Invoice Amount </label>

//       <TableContainer component={Paper} className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
//         <Table  aria-label="simple table">
//           <TableHead>
//             <TableRow className="table-header" style={{ position: 'sticky', top: '0',backgroundColor:  colors.primary[400] }}>
//               <TableCell style={{ fontSize: '13px', padding: '8px', margin: '0' }}><b>Product Category</b></TableCell>
//               <TableCell style={{ fontSize: '13px', padding: '8px', margin: '0' }}><b>Customer Name</b></TableCell>
//               <TableCell style={{ fontSize: '13px', padding: '8px', margin: '0' }} align="left"><b>Total Invoice Amount</b></TableCell>
//               <TableCell style={{ fontSize: '13px', padding: '8px', margin: '0' }} align="left"><b>Date Module</b></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//               {table_data && (table_data.map((row, index) => (
//                 <TableRow
//                   key={index}
//                   className="table-row"
//                   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                 >
//                   <TableCell component="th" scope="row">{row.MATKL_Material_Category} </TableCell>
//                   <TableCell >{row.customer_name}</TableCell>
//                   <TableCell >{row.TotalInvoiceAmount}</TableCell>
//                   <TableCell >{row.Date_Module}</TableCell>
//                 </TableRow>
//               )))}
//             </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default CompanyWiseTotalInvoiceAmount;
import React from 'react';
import {
  Paper,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import '../../../style/Table.css';
import { tokens } from "../../../theme";

const CompanyWiseTotalInvoiceAmount = ({ table_data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <label>Product Category Wise Total Invoice Amount </label>

      <TableContainer component={Paper} className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow className="table-header" style={{ position: 'sticky', top: '0', backgroundColor: '#D4D4D4' }}>
              <TableCell style={{ fontSize: '13px', padding: '8px', margin: '0' }}><b>Product Category</b></TableCell>
              <TableCell style={{ fontSize: '13px', padding: '8px', margin: '0' }}><b>Dealer Name</b></TableCell>
              <TableCell style={{ fontSize: '13px', padding: '8px', margin: '0' }} align="left"><b>Total Invoice Amount</b></TableCell>
              <TableCell style={{ fontSize: '13px', padding: '8px', margin: '0' }} align="left"><b>Month</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {table_data && (table_data.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row, index) => (
              <TableRow key={index} className={index === 0 ? "table-header" : "table-row"} style={{ position: 'sticky', top: '0', backgroundColor: colors.primary[400] }}>
                <TableCell component="th" scope="row">{row.MATKL_Material_Category}</TableCell>
                <TableCell>{row.customer_name}</TableCell>
                <TableCell>{row.TotalInvoiceAmount}</TableCell>
                <TableCell>{row.Date_Module}</TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add TablePagination component at the end of your component */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50,100,200]}
        component="div"
        count={table_data ? table_data.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default CompanyWiseTotalInvoiceAmount;

 

