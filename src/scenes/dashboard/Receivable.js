import {
  Box, useTheme, Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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


function RecievableDetails() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customerDetails, setCustomerDetails] = useState({ top: [], bottom: [] });
  const [openTopTab, setOpenTopTab] = useState(true);
  const [openBottomTab, setOpenBottomTab] = useState(false);
  const navigate = useNavigate();

  const fatchedDashboardData = async () => {
    try {
      const response = await apiService.DashboardRecievable();
      setCustomerDetails({ top: response.Top_customer, bottom: response.Bottom_customer })
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fatchedDashboardData()
    return () => {
    }
  }, [])


  const setSelectedRouting = (data) => {
   navigate(`/sales_marketing?customer=${data.customer_name}`);
  }

  //---------------------Tabs-------------------
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      setOpenBottomTab(!openBottomTab);
      setOpenTopTab(!openTopTab);
    } else {
      setOpenBottomTab(!openBottomTab);
      setOpenTopTab(!openTopTab);
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
    <Box >
      <Card
        sx={{
          m: '0 0 15px 0px',
          color: colors.grey[100],
          // backgroundColor: colors.primary[400],
        }}
        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
      >
        <label style={{ fontWeight: 'bold', paddingLeft: '20px', paddingTop: '10px', fontSize: '22px' }}>Receivable</label>
        <CardContent sx={{ minHeight: 250, marginTop: '0px !important', paddingTop: '0px !important' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor="secondary">
              <Tab icon={openTopTab ? <CircleIcon /> : <CircleOutlinedIcon />}
                iconPosition="start" label="Top 5 Customer" {...a11yProps(0)} style={{ minHeight: '40px !important' }} />
              <Tab icon={openBottomTab ? <CircleIcon /> : <CircleOutlinedIcon />}
                iconPosition="start" label="Bottom 5 Customer" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Collapse in={openTopTab} timeout="auto" unmountOnExit>
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: colors.grey[999] }}>
                    <TableRow>
                      <TableCell>Customer Name</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>Billed Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customerDetails.top && (customerDetails.top.map((row, index) => (
                      <TableRow
                        onClick={() => setSelectedRouting(row)}

                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell >{row.customer_name} </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }} >
                          ₹ {row.OrderValue.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</TableCell>
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Collapse in={openBottomTab} timeout="auto" unmountOnExit>
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: colors.grey[999] }}>
                    <TableRow>
                      <TableCell>Customer Name</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>Billed Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customerDetails.bottom && (customerDetails.bottom.map((row, index) => (
                      <TableRow
                        onClick={() => setSelectedRouting(row)}
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell >{row.customer_name} </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }} >
                          ₹{row.OrderValue.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</TableCell>
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </CustomTabPanel>
        </CardContent>
      </Card>
    </Box>
  )
}

export default RecievableDetails