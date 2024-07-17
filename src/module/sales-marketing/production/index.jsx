import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Cart from "@mui/icons-material/Email";
import Header from "../../../components/Header";

const ProductCategories = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
   
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* <Header title="Procurement (Purchase):" subtitle="Welcome to your dashboard" /> */}
        <Header title="Product Categories"  />
       
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
         
        </Box>
      
       
      </Box>
    </Box>
 
  );
};

export default ProductCategories;
