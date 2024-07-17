

import { useState } from "react";
import { Routes, Route, useLocation, Router } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Protected from "./scenes/router-guard/index"
// import Dashboard from "./scenes/dashboard";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./scenes/login";
import DispatchSupplychain from "./module/supplychain/dispatch";
import Collection from "./module/supplychain/collection";
import StockFinishedGoods from "./module/supplychain/stock-finished-goods";
import Billing from "./module/supplychain/billing";
import Production from "./module/supplychain/production";
import Stockrawmaterials from "./module/supplychain/stock-raw-materials";
import ProductCategories from "./module/sales-marketing/production";
import Purchase from "./module/supplychain/purchase";
import AdminLogin from "./admin-module/pages/login";
import UserAccess from "./admin-module/pages/usera-ccess";
import DatabaseConfig from "./admin-module/pages/database-config";
import BenchmarkValueUpd from "./admin-module/pages/benchmark-value-upd";
import MarketingModule from "./module/sales-marketing/marketing";
import DashboardTest from "./scenes/dashboard/NewDashboard";
import SalesModule from "./module/sales-marketing/sales";
import QuestionAnswer from "./module/question-answer";
import productionsales from "./module/sales-marketing/productionsales";
import KeyAccountManager from "./module/sales-marketing/key-account-manager/index";
import ChannelPartnerPage from "./module/sales-marketing/channel-partner/index";
import IndustrialDataManagement from './pages/IndustrialDataManagement';
import IndustrialUseCase from './pages/IndustrialUseCase';
import Mlusecases from './pages/Mlusecases';
import Generativeai from './pages/Generativeai';



function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  // const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isLoginPage = currentPath === "/";
  const isAdminLoginPage = currentPath === "/admin-login";
  const isUserAccess = currentPath === "/user-access";
  const isDatabaseConfig = currentPath === "/database-config";
  const isbenchmarkValueUpd = currentPath === "/benchmark-value-upd";

  const toggleSidebar = () => {
    setIsSidebar(!isSidebar);
  };
  const shouldShowHeaderAndSidebar = () => {
    return (
      !isLoginPage &&
      !isAdminLoginPage &&
      !isUserAccess &&
      !isDatabaseConfig
    );
  };

  const shouldShowTopBar = () => {
    return shouldShowHeaderAndSidebar() && !["/home","/Mlusecasse","/Generativeai","/dashboard", "/industrial-data-management", "/industrial-use-case"].includes(currentPath);
  };

  const shouldShowSidebar = () => {
    return shouldShowHeaderAndSidebar() && !["/home","/Mlusecasse","/Generativeai","/dashboard", "/industrial-data-management", "/industrial-use-case"].includes(currentPath);
  };
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app bg-image">
          {shouldShowSidebar() && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {shouldShowTopBar() && <Topbar setIsSidebar={toggleSidebar} />}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/stock_raw_materials" element={<Protected Component={Stockrawmaterials} />} />
              <Route path="/purchase" element={<Protected Component={Purchase} />} />
              <Route path="/billing" element={<Protected Component={Billing} />} />
              <Route path="/production" element={<Protected Component={Production} />} />
              <Route path="/stock_finished_goods" element={<Protected Component={StockFinishedGoods} />} />
              <Route path="/dispatch" element={<Protected Component={DispatchSupplychain} />} />
              <Route path="/billing" element={<Protected Component={Billing} />} />
              <Route path="/collection" element={<Protected Component={Collection} />} />
              <Route path="/production_plan" element={<Protected Component={ProductCategories} />} />
              <Route path="/marketing" element={<Protected Component={MarketingModule} />} />
              <Route path="/sales_marketing" element={<SalesModule />} />
              <Route path="/Key_Account_Manager" element={<Protected Component={KeyAccountManager} />} />
              <Route path="/question_answer" element={<Protected Component={QuestionAnswer} />} />
              <Route path="/Channel_Partner" element={<Protected Component={ChannelPartnerPage} />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/user-access" element={<UserAccess />} />
              <Route path="/database-config" element={<DatabaseConfig />} />
              <Route path="/benchmark-value-upd" element={<BenchmarkValueUpd />} />
              <Route path="/productionsales1" element={<Protected Component={productionsales} />} />
              <Route path="/dashboard123" element={<Dashboard />} />
              <Route path="/dashboard" element={<Home />} />
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="/industrial-data-management" element={<IndustrialDataManagement />} />
              <Route path="/industrial-use-case" element={<IndustrialUseCase />} />
              <Route path="/Mlusecasse" element={<Mlusecases />} />
              <Route path="/Generativeai" element={<Generativeai />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>

  );
}

export default App;