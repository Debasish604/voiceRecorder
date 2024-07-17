import {
  Box, useTheme, Typography,
  Card,
  CardContent,
  // Radio,
  // RadioGroup,
  // FormControlLabel,
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
//-----------Tabs---------------
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


function InventoryDetails() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState(0);
  const [valueRawMat, setValueRawMat] = useState(0);
  const [valueFins, setValueFins] = useState(0);
  const navigate = useNavigate();
  const [supplierDetails, setSupplierDetails] = useState({ top: [], bottom: [] });
  const [openPurchaseTop, setOpenPurchaseTop] = useState(true);
  const [openPurchaseBottom, setOpenPurchaseBottom] = useState(false);
  //----------Stock Waw Material--------------
  const [openPurchaseTopRaw, setOpenPurchaseTopRaw] = useState(true);
  const [openPurchaseBottomRaw, setOpenPurchaseBottomRaw] = useState(false);
  //----------Stock finshed --------------
  const [plantDetails, setPlantsDetails] = useState({ top: [], bottom: [] });
  const [openTopFins, setOpenTopFins] = useState(true);
  const [openBottomFins, setOpenBottomFins] = useState(false);

  const fatchedDashboardData = async () => {
    try {
      const response = await apiService.DashboardStockRawMaterial();
      setSupplierDetails({ top: response.Top_clients, bottom: response.Bottom_clients })
      setPlantsDetails({ top: response.Top_plants, bottom: response.Bottom_plants })
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fatchedDashboardData()
    return () => {

    }
  }, [])
  const setSelectedRoutingRow = (data) => {
    if (value === 0) {
      console.log('Stock Raw Materials');
      console.log('selected row 0',data);
      navigate(`/stock_raw_materials?supplier=${data.MTEXT_ClientName}`);
    } else {
      console.log('Stock Finished Goods');
      console.log('selected row 1',data);
      navigate(`/stock_finished_goods?plant=${data.plant_name}`);

    }
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
  const handleChangeRawMaterial = (event, newValue) => {
    setValueRawMat(newValue);
    if (newValue === 0) {
      setOpenPurchaseBottomRaw(!openPurchaseBottomRaw);
      setOpenPurchaseTopRaw(!openPurchaseTopRaw);
    } else {
      setOpenPurchaseBottomRaw(!openPurchaseBottomRaw);
      setOpenPurchaseTopRaw(!openPurchaseTopRaw);
    }
  };
  const handleChangeFinshed = (event, newValue) => {
    setValueFins(newValue);
    if (newValue === 0) {
      setOpenBottomFins(!openBottomFins);
      setOpenTopFins(!openTopFins);
    } else {
      setOpenBottomFins(!openBottomFins);
      setOpenTopFins(!openTopFins);
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
    <Box>
      <Card
        sx={{
          m: '0 0 15px 0px',
          color: colors.grey[100],
          // backgroundColor: colors.primary[400],
        }}
        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
      >
        <label style={{ fontWeight: 'bold', paddingLeft: '20px', paddingTop: '10px', fontSize: '22px' }}>Inventory</label>

        <CardContent sx={{ minHeight: 250, marginTop: '0px !important', paddingTop: '0px !important' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor="secondary">
              <Tab icon={openPurchaseTop ? <CircleIcon /> : <CircleOutlinedIcon />}
                iconPosition="start" label="Stock Raw Materials " {...a11yProps(0)} />
              <Tab icon={openPurchaseBottom ? <CircleIcon /> : <CircleOutlinedIcon />}
                iconPosition="start" label="Stock Finished Goods" {...a11yProps(1)} />
            </Tabs>
          </Box>
          {/* Stock Raw Material */}
          <CustomTabPanel value={value} index={0}>
            <Tabs value={valueRawMat} onChange={handleChangeRawMaterial} indicatorColor="white" textColor="secondary">
              <Tab icon={openPurchaseTopRaw ? <CircleIcon /> : <CircleOutlinedIcon />}
                iconPosition="start" label="Top 5 Stock Raw Materials  " {...a11yProps(0)} style={{padding:'17px 6px'}}/>
              <Tab icon={openPurchaseBottomRaw ? <CircleIcon /> : <CircleOutlinedIcon />}
                iconPosition="start" label="Bottom 5 Stock Raw Materials" {...a11yProps(1)}  style={{padding:'17px 6px'}}/>
            </Tabs>
            <CustomTabPanel value={valueRawMat} index={0}>
              <Collapse in={openPurchaseTopRaw} timeout="auto" unmountOnExit>
                <TableContainer style={{ maxHeight: '158px' }}>
                  <Table >
                    <TableHead sx={{ backgroundColor: colors.grey[999] }}>
                      <TableRow >
                        <TableCell>Supplier Name</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Inventory Turnover</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody >
                      {supplierDetails.top && (supplierDetails.top.map((row, index) => (
                        <TableRow
                          onClick={() => setSelectedRoutingRow(row)}
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell >{row.MTEXT_ClientName} </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }} >
                            {row.InventoryTurnover.toFixed(2)}%</TableCell>
                        </TableRow>
                      )))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
            </CustomTabPanel>
            <CustomTabPanel value={valueRawMat} index={1}>
              <Collapse in={openPurchaseBottomRaw} timeout="auto" unmountOnExit>
                <TableContainer style={{ maxHeight: '158px' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: colors.grey[999] }}>
                      <TableRow>
                        <TableCell>Supplier Name</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Inventory Turnover</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {supplierDetails.bottom && (supplierDetails.bottom.map((row, index) => (
                        <TableRow
                          onClick={() => setSelectedRoutingRow(row)}
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell >{row.MTEXT_ClientName} </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }} >
                            {row.InventoryTurnover.toFixed(2)}%</TableCell>
                        </TableRow>
                      )))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
            </CustomTabPanel>
          </CustomTabPanel>
          {/* Stock Finished Goods */}
          <CustomTabPanel value={value} index={1}>
            <Tabs value={valueFins} onChange={handleChangeFinshed} indicatorColor="white" textColor="secondary">
              <Tab icon={openTopFins ? <CircleIcon /> : <CircleOutlinedIcon />}
                iconPosition="start" label="Top 5 Plants " {...a11yProps(0)} />
              <Tab icon={openBottomFins ? <CircleIcon /> : <CircleOutlinedIcon />}
                iconPosition="start" label="Bottom 5 Plants" {...a11yProps(1)} />
            </Tabs>
            <CustomTabPanel value={valueFins} index={0}>
              <Collapse in={openTopFins} timeout="auto" unmountOnExit>
                <TableContainer style={{ maxHeight: '158px' }}>
                  <Table >
                    <TableHead sx={{ backgroundColor: colors.grey[999] }}>
                      <TableRow>
                        <TableCell>Plant Name</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Stock to Sales Ratio</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody >
                      {plantDetails.top && (plantDetails.top.map((row, index) => (
                        <TableRow
                          onClick={() => setSelectedRoutingRow(row)}
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell >{row.plant_name} </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }} >
                            {row.StocktoSalesRatio.toFixed(2)}%</TableCell>
                        </TableRow>
                      )))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
            </CustomTabPanel>
            <CustomTabPanel value={valueFins} index={1}>
              <Collapse in={openBottomFins} timeout="auto" unmountOnExit>
                <TableContainer style={{ maxHeight: '158px' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: colors.grey[999] }}>
                      <TableRow>
                        <TableCell>Plant Name</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Stock To Sales ratio</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {plantDetails.bottom && (plantDetails.bottom.map((row, index) => (
                        <TableRow
                          onClick={() => setSelectedRoutingRow(row)}
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell >{row.plant_name} </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }} >
                            {row.StocktoSalesRatio.toFixed(2)}%</TableCell>
                        </TableRow>
                      )))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
            </CustomTabPanel>
          </CustomTabPanel>
        </CardContent>
      </Card>
    </Box>
  )
}

export default InventoryDetails