import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Cart from "@mui/icons-material/Email";
import Header from "../../../components/Header";
import StatBox from "../../../components/StatBox";

const ProductionModule = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* <Header title="Procurement (Purchase):" subtitle="Welcome to your dashboard" /> */}
        <Header title="Production Module" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            //title="12,361"
            subtitle="Total Sales Volume (Quantity)"
            // progress="0.75"
            // increase="+14%"
            icon={
              <Cart
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            //title="12,361"
            subtitle="Sales by Product Category"
            // progress="0.75"
            // increase="+14%"
            icon={
              <Cart
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

      </Box>
    </Box>
  );
};

export default ProductionModule;
