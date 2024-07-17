import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import GlobalCard from "../../../components/GlobalCard";
//----------------------For Date filter -------------------------------
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  calculateGroupBySum,
  dateFormationDataKey,
  formatDays,
  calculateGroupByAverage,
  calculateAveragePercentage,
  calculateAverage,
  calculateSum,
  filterByDateAndClient,
  filterByDateClientProduct,
  formatPersentage
} from "../../../utils/GlobalFilters";
import { useState } from "react";
import { useEffect } from "react";
import { apiService } from "../../../service/api-service";
import ProductSelect from "../../../components/filter-dropdown/ProductCategory";
import RadialBarChart from "../../../components/charts/RadialBar";
import DonutCharts from "../../../components/charts/DonutChart";
import DistributedColumnChart from "../../../components/charts/DistributedColumnChart";

const SchemsModule = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //-------------------------Conversion Rate---------------------------
  const [ConversionRateData, setConversionRateData] = useState([])

  //----------------------For filter -------------------------------
  const [selectedDate, setSelectedDate] = useState('');
  const [monthYear, setmonthYear] = useState('Select month and year')
  const currentDate = new Date();

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('')

  const fetchData = async () => {
    try {
      // setLoading(true);
      const response = await apiService.Conversion_Rate();
      console.log("Conversion_Rate", response);


      //-------------------------Conversion Rate---------------------------
      const ConversionRateResponse = await apiService.Conversion_Rate();
      setConversionRateData(ConversionRateResponse.Conversion_Rate_from_Scheme_Participants_Forecast)
      console.log("ConversionRateResponse", ConversionRateResponse.Conversion_Rate_from_Scheme_Participants_Forecast);
      if (ConversionRateResponse.status === 'success'  ) {
      



      }



    } catch (error) {
      // console.error('Error fetching data:', error.message);
    }
    finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  //For Chat
  const inventoryData = [
    { MATKL_Material_Category: 'Category 1', InventoryTurnover: 25 },
    { MATKL_Material_Category: 'Category 2', InventoryTurnover: 15 },
    { MATKL_Material_Category: 'Category 3', InventoryTurnover: 30 },
    { MATKL_Material_Category: 'Category 4', InventoryTurnover: 10 },
    { MATKL_Material_Category: 'Category 5', InventoryTurnover: 25 },
    { MATKL_Material_Category: 'Category 6', InventoryTurnover: 20 },
    { MATKL_Material_Category: 'Category 7', InventoryTurnover: 35 },
  ];
  const InventoryTurnover = inventoryData.map(item => item.InventoryTurnover);
  const MATKL_Material_Category = inventoryData.map(item => item.MATKL_Material_Category);


  const fetchClients = async () => {
    try {
      const response = await apiService.filterdropdown();
      const clientData = response.client || [];
      setClients(clientData);
      if (clientData.length > 0) {
        setSelectedClient(clientData[0].MTEXT_ClientName);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fetchClients()
  }, []);

  useEffect(() => {
    const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
    setSelectedDate(formattedDataDate)
    setmonthYear('Selected month and year')
    return () => {
    };
  }, [clients]);

  const handleDateChange = () => { }
  const handleClientChange = async (event) => {
    const selectedValue = event
    setSelectedClient(event);
    console.log('selected value :', selectedValue);

    if (selectedProduct !== "") {

    }
    else {

    }

  };
  const productChange = (selectedValue) => {

    setSelectedProduct(selectedValue.target.value)
    const selectedProductCate = selectedValue.target.value

    if (selectedClient !== "") {

    }
    else {

    }
  };


  return (
    <Box m="20px">
      <Grid container spacing={2}>
        <Grid item xs={3} md={3}>
          <Typography
            variant="h2"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 5px" }}
          >Schemes</Typography>
        </Grid>

        <Grid item xs={3} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}  >
            <DemoContainer components={['DatePicker']} sx={{ marginTop: '-7px' }}>
              <DatePicker
                label={monthYear}
                openTo="month"
                views={['year', 'month']}
                defaultValue={dayjs(currentDate)}
                onChange={handleDateChange}
                sx={{ width: '300px' }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>

        <Grid item xs={3} md={3}>
          <FormControl fullWidth>
            <InputLabel id="client-select-label">Supplier Name</InputLabel>
            <Select
              labelId="client-select-label"
              id="client-select"
              value={selectedClient}
              label="Client"
              sx={{ minWidth: '250px' }}
              MenuProps={{
                PaperProps: { style: { maxHeight: '250px' } }
              }}
              onChange={(event) => {
                handleClientChange(event.target.value);
              }}
            >
              {clients.map((client, i) => (
                <MenuItem key={i} value={client.MTEXT_ClientName}>
                  {client.MTEXT_ClientName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3} md={3}>
          <ProductSelect product_change={productChange} />
        </Grid>

      </Grid>

      <Grid container spacing={2} marginTop={2}>
        <Grid xs={4} md={4} >
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <GlobalCard
              title="Conversion Rate from Scheme Participants"
              // subtitle={AverageCashToCashCycleTimeCard?.toString() ?? 'Loading...'}
              subtitle={37}
              units="%"
              benchmark='high'
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={2}>
        {/* <Grid xs={6}>
          <label>ROI for the Scheme/ Scheme discount percentage</label>
          <DonutCharts series={InventoryTurnover}
            labels={MATKL_Material_Category}
            height="320" />
        </Grid> */}

        <Grid item xs={6} md={6}>
          <label>ROI for the Scheme/ Scheme discount percentage</label>
          <DistributedColumnChart
            labels={MATKL_Material_Category}
            series={InventoryTurnover}
            height='320'
            legend='Scheme discount percentage (%)'
            format_func={formatPersentage}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SchemsModule;
