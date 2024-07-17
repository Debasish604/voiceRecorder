import {
  Box, useTheme, Typography,
  Grid,

} from "@mui/material";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { apiService } from "../../service/api-service";
//------------new---------------------
import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
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


const DashboardTest = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [supplierDetails, setSupplierDetails] = useState({ top: [], bottom: [] });

  const [open, setOpen] = useState(true);


  const handleClick = () => {
    setOpen(!open);
  };

  const fatchedSupplierData = async () => {
    try {
      const response = await apiService.dashboardTopBottomClient();
      setSupplierDetails({ top: response.Top_clients, bottom: response.Bottom_clients })

    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fatchedSupplierData()

    return () => {

    }
  }, [])


  const handleClick3 = (index) => {
    const updatedSupplierDetails = [...supplierDetails.top];
    updatedSupplierDetails[index].open3 = !updatedSupplierDetails[index].open3;
    setSupplierDetails({ ...supplierDetails, top: updatedSupplierDetails });
  };

 

  const renderScoreDetails = (supplier) => (
    <List component="div" disablePadding>
      <ListItemButton sx={{ pl: 6 }}>
        <ListItemIcon>
          <SubdirectoryArrowRightIcon />
        </ListItemIcon>
        <label style={{ fontWeight: 'bold' }}>Supplier Quality Score :</label>
        <label style={{ color: 'green', fontWeight: 'bold' }}> &nbsp; {supplier.SupplierQualityIndex.toFixed(2)} %</label>
      </ListItemButton>
    </List>
  );

  const renderSupplierListItem = (supplier, index) => (
    <React.Fragment key={supplier.MANDT}>
      <ListItemButton onClick={() => handleClick3(index)} sx={{ pl: 4 }}>
        <ListItemIcon>
          {supplier.open3 ? <CircleIcon /> : <CircleOutlinedIcon />}
        </ListItemIcon>
        <ListItemText primary={supplier.MTEXT_ClientName} />
        {supplier.open3 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      {supplier.open3 && renderScoreDetails(supplier)}
    </React.Fragment>
  );


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
        <Grid item xs={6} md={6}>
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', borderRadius: '5px' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader" style={{ fontSize: '22px' }}>
                Purchase
              </ListSubheader>
            }
          >
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                {open ? <CircleIcon /> : <CircleOutlinedIcon />}
              </ListItemIcon>
              <ListItemText primary="Top 5 Supplier" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {supplierDetails.top.map((supplier, index) => renderSupplierListItem(supplier, index))}
              </List>
            </Collapse>

          </List>
        </Grid>

      </Grid>
    </Box>
  );
};

export default DashboardTest;
