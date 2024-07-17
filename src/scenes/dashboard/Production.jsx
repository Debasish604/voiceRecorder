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
// import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { apiService } from "../../service/api-service";
import { useNavigate,Link } from 'react-router-dom';
//------------new---------------------
import * as React from 'react';
// import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

//-----------Tabs---------------
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


function ProductionDetails() {
    const theme = useTheme();
    const navigate = useNavigate();
    const colors = tokens(theme.palette.mode);
    const [plantDetails, setPlantDetails] = useState({ top: [], bottom: [] });
    const [openTopTab, setOpenTopTab] = useState(true);
    const [openBottomTab, setOpenBottomTab] = useState(false);

    const fatchedDashboardData = async () => {
        try {
            const response = await apiService.DashboardProduction();
            setPlantDetails({ top: response.Top_plants, bottom: response.Bottom_plants })
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
        navigate(`/production?plant=${data.Plant_Name}`);
      
    }


    const handleClickSupplierTop = (index) => {
        const updatedSupplierDetails = [...plantDetails.top];
        updatedSupplierDetails[index].openChildObject = !updatedSupplierDetails[index].openChildObject;
        setPlantDetails({ ...plantDetails, top: updatedSupplierDetails });
    };
    const handleClickSupplierBottom = (index) => {
        const updatedSupplierDetails = [...plantDetails.bottom];
        updatedSupplierDetails[index].openChildObject = !updatedSupplierDetails[index].openChildObject;
        setPlantDetails({ ...plantDetails, bottom: updatedSupplierDetails });
    };

    const renderSupplierListItemTop = (data, index) => (
        <React.Fragment key={data.MANDT}>
            <ListItemButton onClick={() => handleClickSupplierTop(index)} sx={{ pl: 0 }}>
                <ListItemIcon>
                    {data.openChildObject ? <CircleIcon /> : <CircleOutlinedIcon />}
                </ListItemIcon>
                <ListItemText primary={data.NAME1_Plant_Name} />
                {data.openChildObject ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            {data.openChildObject && renderScoreDetails(data)}
        </React.Fragment>
    );
    const renderSupplierListItemBottom = (data, index) => (
        <React.Fragment key={data.MANDT}>
            <ListItemButton onClick={() => handleClickSupplierBottom(index)} sx={{ pl: 0 }}>
                <ListItemIcon>
                    {data.openChildObject ? <CircleIcon /> : <CircleOutlinedIcon />}
                </ListItemIcon>
                <ListItemText primary={data.NAME1_Plant_Name} />
                {data.openChildObject ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            {data.openChildObject && renderScoreDetails(data)}
        </React.Fragment>
    );

    const renderScoreDetails = (data) => (
        <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 0 }}>
                <ListItemIcon>
                    <SubdirectoryArrowRightIcon />
                </ListItemIcon>
                <label style={{ fontWeight: 'bold' }}>Production Plan Variance :</label>
                <label style={{ color: 'green', fontWeight: 'bold' }}> &nbsp; {data.Production_PlanVariance.toFixed(2)} %</label>
            </ListItemButton>
            {/* <ListItemButton sx={{ pl: 6 }}>
          <ListItemIcon>
            <SubdirectoryArrowRightIcon />
          </ListItemIcon>
          <label style={{ fontWeight: 'bold' }}>Supplier Risk Score Score :</label>
          <label style={{ color: 'red', fontWeight: 'bold' }}> &nbsp; 65.00 %</label>
        </ListItemButton> */}
        </List>
    );

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
                <label style={{ fontWeight: 'bold', paddingLeft: '20px', paddingTop: '10px', fontSize: '22px' }}>Production</label>
                <CardContent sx={{ minHeight: 327, marginTop: '0px !important', paddingTop: '0px !important' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor="secondary">
                            <Tab icon={openTopTab ? <CircleIcon /> : <CircleOutlinedIcon />}
                                iconPosition="start" label="Top 5 Plant" {...a11yProps(0)} style={{ minHeight: '40px !important' }} />
                            <Tab icon={openBottomTab ? <CircleIcon /> : <CircleOutlinedIcon />}
                                iconPosition="start" label="Bottom 5 Plant" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <Collapse in={openTopTab} timeout="auto" unmountOnExit>
                            {/* <List component="div" disablePadding>
                                {plantDetails.top.map((item, index) => renderSupplierListItemTop(item, index))}
                            </List> */}
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ backgroundColor: colors.grey[999] }}>
                                        <TableRow>
                                            <TableCell>Plant Name</TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>Production Plan Variance</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {plantDetails.top && (plantDetails.top.map((row, index) => (
                                            <TableRow
                                                onClick={() => setSelectedRouting(row)}
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell >{row.Plant_Name} </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }} >{row.Production_PlanVariance.toFixed(2)}%</TableCell>
                                            </TableRow>
                                        )))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Collapse>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <Collapse in={openBottomTab} timeout="auto" unmountOnExit>
                            {/* <List component="div" disablePadding>
                                {plantDetails.bottom.map((item, index) => renderSupplierListItemBottom(item, index))}
                            </List> */}
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ backgroundColor: colors.grey[999] }}>
                                        <TableRow>
                                            <TableCell>Plant Name</TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>Production Plan Variance</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {plantDetails.bottom && (plantDetails.bottom.map((row, index) => (
                                            <TableRow
                                                onClick={() => setSelectedRouting(row)}
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell >{row.Plant_Name} </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }} >{row.Production_PlanVariance.toFixed(2)}%</TableCell>
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

export default ProductionDetails