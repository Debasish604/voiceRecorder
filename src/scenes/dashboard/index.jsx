import {
  Box, useTheme, Typography,
  Grid,
  Card,
  CardContent,
  // Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  // CardHeader
} from "@mui/material";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { apiService } from "../../service/api-service";
import { useNavigate } from 'react-router-dom';
//------------new---------------------
import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CircleIcon from '@mui/icons-material/Circle';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InventoryDetails from "./Inventory";
import ProductionDetails from "./Production";
import DispatchDetails from "./Dispatch";
import ReceivableDetails from "./Receivable";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [supplierDetails, setSupplierDetails] = useState({ top: [], bottom: [] });
  const [value, setValue] = useState(0);

  const [openPurchaseTop, setOpenPurchaseTop] = useState(true);
  const [openPurchaseBottom, setOpenPurchaseBottom] = useState(false);

  const navigate = useNavigate();

  const fatchedDashboardData = async () => {
    try {
      const response = await apiService.dashboardTopBottomClient();
      // console.log("response", response);
      setSupplierDetails({ top: response.Top_clients, bottom: response.Bottom_clients })

    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fatchedDashboardData()
    return () => {

    }
  }, [])

  const setSelectedPurchaseRow = (data) => {
    // console.log('selected row',data);
    navigate(`/purchase?supplier=${data.MTEXT_ClientName}`);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      setOpenPurchaseBottom(!openPurchaseBottom);
      setOpenPurchaseTop(!openPurchaseTop);
    } else {
      setOpenPurchaseBottom(!openPurchaseBottom);
      setOpenPurchaseTop(!openPurchaseTop);
    }
  };


  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box m="20px">
      <Grid container spacing={2}>
        <Grid item xs={3} md={3}>
          <Typography
            variant="h2"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 5px" }}
          >Dashboard</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} >
        {/* Purchase Page */}
        <Grid item xs={4} md={4}>
          <Card
            sx={{
              m: '0 0 15px 0px',
              color: colors.grey[100],
              // backgroundColor: colors.primary[400],
            }}
            style={{ cursor: 'pointer', transition: 'transform 0.2s'}}
          >
            <label style={{ fontWeight: 'bold', paddingLeft: '20px', paddingTop: '10px', fontSize: '22px' }}>Purchase</label>
            <CardContent sx={{marginTop: '0px !important', paddingTop: '0px !important',minHeight:'327px' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor="secondary">
                  <Tab icon={openPurchaseTop ? <CircleIcon /> : <CircleOutlinedIcon />}
                    iconPosition="start" label="Top 5 Supplier" {...a11yProps(0)} style={{ minHeight: '40px !important' }} />
                  <Tab icon={openPurchaseBottom ? <CircleIcon /> : <CircleOutlinedIcon />}
                    iconPosition="start" label="Bottom 5 Supplier" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <Collapse in={openPurchaseTop} timeout="auto" unmountOnExit>
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ backgroundColor: colors.grey[999] }}>
                        <TableRow>
                          <TableCell>Supplier Name</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>Supplier Quality Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {supplierDetails.top && (supplierDetails.top.map((row, index) => (
                          <TableRow

                            onClick={() => setSelectedPurchaseRow(row)}
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell >{row.MTEXT_ClientName} </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }} >
                              {row.SupplierQualityIndex.toFixed(2)}%</TableCell>
                          </TableRow>
                        )))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Collapse>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Collapse in={openPurchaseBottom} timeout="auto" unmountOnExit>
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ backgroundColor: colors.grey[999] }}>
                        <TableRow>
                          <TableCell>Supplier Name</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>Supplier Quality Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {supplierDetails.bottom && (supplierDetails.bottom.map((row, index) => (
                          <TableRow
                            onClick={() => setSelectedPurchaseRow(row)}
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell >{row.MTEXT_ClientName} </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }} >
                              {row.SupplierQualityIndex.toFixed(2)}%</TableCell>
                          </TableRow>
                        )))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Collapse>
              </CustomTabPanel>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4} md={4}>
          <InventoryDetails />
        </Grid>
        <Grid item xs={4} md={4}>
          <ProductionDetails />
        </Grid>
      </Grid>
      <Grid container spacing={2} >
        <Grid item xs={4} md={4}>
          <DispatchDetails />
        </Grid>
        <Grid item xs={4} md={4}>
          <ReceivableDetails />
        </Grid>
      </Grid>

    </Box>
  );
};

export default Dashboard;
