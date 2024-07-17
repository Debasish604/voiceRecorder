import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { apiService } from "../../service/api-service";

export default function ProductSelect(props) {

  const [products, setproducts] = useState([]);
  const [selectedProducts, setselectedProducts] = useState('All');
  
  // console.log('clear',props);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.filterdropdown();
        const productsData = response.Product_Category || [];
        setproducts(productsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (event) => {
    const selectedValue = event.target.value;
    setselectedProducts(selectedValue);
  };

  useEffect(() => {
    // console.log('clear in use',props);
    if (props.clear_product==='All') {
      setselectedProducts('')
    } else {
      
    }
    // console.log('Selected client on component load:', selectedClient);
  }, [props.clear_product]);

  const productWithAll = [{ MATKL_Material_Category: 'All' }, ...products];

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="client-select-label">Products Category</InputLabel>
        <Select
          labelId="client-select-label"
          id="client-select"
          value={selectedProducts}
          label="Products"
          sx={{
            minWidth: '250px',
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: '250px',
              },
            },
          }}

          onChange={(event) => {
            props.product_change(event);
            handleProductChange(event);
          }}
        >
          {productWithAll.map((item, i) => (
            <MenuItem key={i} value={item.MATKL_Material_Category}>
              {item.MATKL_Material_Category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}