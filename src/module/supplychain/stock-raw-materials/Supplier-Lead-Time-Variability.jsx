import React from 'react';
import { Paper, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import '../../../style/Table.css';
import { tokens } from "../../../theme";

const SupplierLeadTimeVariability = ({ table_data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // console.log('props', table_data);
  return (
    <div>
      <label>Supplier Lead Time Variability </label>
      {/* {table_data.length > 0 && */}
        <TableContainer component={Paper} className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow className="table-header" style={{ position: 'sticky', top: '0', backgroundColor: colors.primary[400] }}>
                <TableCell style={{ fontSize: '13px' }}><b>Product Category</b></TableCell>
                <TableCell style={{ fontSize: '13px' }}><b>Supplier Name</b></TableCell>
                <TableCell style={{ fontSize: '13px' }} align="center"><b>Supplier Lead Time Variability</b></TableCell>
                <TableCell style={{ fontSize: '13px' }} ><b>Date Module</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {table_data && (table_data.map((row, index) => (
                <TableRow
                  key={index}
                  className="table-row"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row.MATKL_Material_Category} </TableCell>
                  <TableCell >{row.MTEXT_ClientName}</TableCell>
                  <TableCell align="center">{row.Supplier_Lead_Time_Variability}</TableCell>
                  <TableCell >{row.Date_Module}</TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </TableContainer>
      {/* } */}

    </div>

  );
};

export default SupplierLeadTimeVariability;
