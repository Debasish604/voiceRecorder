import React, { useEffect, useState } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined';
import LowPriorityOutlinedIcon from '@mui/icons-material/LowPriorityOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import TonalityOutlinedIcon from '@mui/icons-material/TonalityOutlined';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import DirectionsIcon from '@mui/icons-material/Directions';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import SchemaIcon from '@mui/icons-material/Schema';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import CircleIcon from '@mui/icons-material/Circle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

import HandshakeIcon from '@mui/icons-material/Handshake';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';


const iconMapping = {
  AnalyticsOutlinedIcon: AnalyticsOutlinedIcon,
  StoreMallDirectoryOutlinedIcon: StoreMallDirectoryOutlinedIcon,
  Inventory2OutlinedIcon: Inventory2OutlinedIcon,
  PrecisionManufacturingIcon: PrecisionManufacturingIcon,
  TonalityOutlinedIcon: TonalityOutlinedIcon,
  LowPriorityOutlinedIcon: LowPriorityOutlinedIcon,
  AccountBalanceWalletIcon: AccountBalanceWalletIcon,
  AccountBoxOutlinedIcon: AccountBoxOutlinedIcon,
  PieChartOutlineOutlinedIcon: PieChartOutlineOutlinedIcon,
  Inventory2Icon: Inventory2Icon,
  CategoryIcon: CategoryIcon,
  AddBusinessIcon: AddBusinessIcon,
  SupportAgentIcon: SupportAgentIcon,
  SchemaIcon: SchemaIcon,
  DirectionsIcon: DirectionsIcon,
  DirectionsRunOutlinedIcon: DirectionsRunOutlinedIcon,
  GroupWorkIcon: GroupWorkIcon,
  ViewModuleIcon: ViewModuleIcon,
  NextPlanIcon: NextPlanIcon,
  QuestionAnswerIcon: QuestionAnswerIcon,
  HandshakeIcon: HandshakeIcon,
  ManageAccountsIcon: ManageAccountsIcon,
};

const getIconComponent = (iconName) => {
  const IconComponent = iconMapping[iconName];
  if (IconComponent) {
    return <IconComponent />;
  } else {
    return <CircleIcon />;
  }
};

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === to}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(to)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};
const Sidebar = () => {
  const location = useLocation()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const [selected, setSelected] = useState("Dashboard");
  const [selected, setSelected] = useState("");
  const storedApiData = localStorage.getItem('apiData');
  const apiData = storedApiData ? JSON.parse(storedApiData) : null;


  useEffect(() => {
    let currentpath = location.pathname
    console.log('path', currentpath);
    setSelected(currentpath)
    // setIsCollapsed(true)

  }, [apiData]);


  const filteredItems = apiData?.data.filter(item => item.HierarchyLable === 1) || [];
  filteredItems.sort((a, b) => a.ModuleID - b.ModuleID);

  // console.log('parent module:', filteredItems);
  // const navigate = useNavigate();
  // const handleMenuItemClick = (item) => {
  //   if (item.Path) {
  //     navigate(item.Path);
  //   }
  // };
  const generateSubmenus = (items, level) => {
    return items.map(item => {
      const apidataDataFilteredByModuleId = apiData?.data.filter(apidata => apidata.ParentModuleID === item.ModuleID && apidata.HierarchyLable === item.HierarchyLable + 1);
      return (
        <React.Fragment key={item.ModuleID}>
          {apidataDataFilteredByModuleId.length > 0 && (
            <SubMenu title={item.ModuleName} icon={getIconComponent(item.Icon)} defaultOpen={item.ModuleName === 'Sales & Marketing' && location.pathname === '/sales_marketing'}>
              {generateSubmenus(apidataDataFilteredByModuleId, level + 1)}
            </SubMenu>
          )
          }
          {
            apidataDataFilteredByModuleId.length === 0 && (
              <Item
                title={item.ModuleName}
                to={item.Path}
                icon={getIconComponent(item.Icon)}
                selected={selected}
                setSelected={setSelected}
              />

            )
          }
        </React.Fragment >
      );
    });
  };
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar width={300} collapsed={isCollapsed} style={{ color: colors.primary[100] }}>
        <Menu iconShape="square" >
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <img
                      alt="profile-user"
                      width="70px"
                      height="70px"
                      src={`../../assets/images/aivista.png`}
                    // style={{ cursor: "pointer", borderRadius: "50%" }}
                    />
                  </Box>
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {generateSubmenus(filteredItems, 1)}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
