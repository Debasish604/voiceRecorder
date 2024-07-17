import { Box, useTheme, Grid, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { useState, useEffect } from "react";
import GlobalCard from "../../../components/GlobalCard";
import { apiService } from '../../../service/api-service';
import BarCharts from "../../../components/charts/Barchart";
import CompanyWiseTotalInvoiceAmount from "./Company_Wise_TotalInvoiceAmount";
import SimpleBackdrop from "../../../scenes/global/Loader";
// import ProductSelect from "../../../components/filter-dropdown/ProductCategory";
import {
  formatDays,
  calculateGroupByAverage,
  calculateAveragePercentage,
  formatRuppes,
  filterByDate,
  filterBenchMarkData,
  filterByDateAndCustomer,
  filterByDateCustomerProduct,
  calculateAverage
} from "../../../utils/GlobalFilters";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//----------------------For Date filter -------------------------------
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DistributedColumnChart from "../../../components/charts/DistributedColumnChart";
import PieCharts from "../../../components/charts/PieCharts";


const Billing = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('')

  //----------------------For Date filter -------------------------------
  const [selectedDate, setSelectedDate] = useState('');
  const [monthYear, setmonthYear] = useState('Select month and year')
  const currentDate = new Date();

  //const [showAllOption, setShowAllOption] = useState(true); // For ALL
  const showAllOption = true; // or false, depending on your requirement

  //-------------------Late Payment Rate------------------------
  const [latePaymentRateData, setLatePaymentRateData] = useState([])
  const [latePaymentRateCard, setLatePaymentRateCard] = useState({ cardValue: null, benchmark: null })
  //-------------------- Bench mark----------------
  const [benchMarkData, setBenchMarkData] = useState([])
  //--------------------Invoice Processing Time----------------
  const [invoiceProcessingTimeData, setInvoiceProcessingTimeData] = useState([])
  const [invoiceProcessingTime, setInvoiceProcessingTime] = useState({ DaysToComplete: [], Delivary_Date: [] })

  //--------------------Total Amount Invoiced per Plant----------------------

  const [amountInvPerPlantData, setAmountInvPerPlantData] = useState([])
  const [amountInvPerPlant, setAmountInvPerPlant] = useState({ Total_Amount_Invoiced: [], customer_name: [] })

  //--------------------Company_Wise_Total_Invoice_Amount----------------
  const [companywiseTotalInvoiceAmountData, setCompanywiseTotalInvoiceAmountData] = useState()
  const [companywiseTotalInvoiceAmountFilter, setCompanywiseTotalInvoiceAmountFilter] = useState()
  //--------------------Billed Value----------------
  const [billedValueData, setBilledValueData] = useState([])
  const [billedValueCard, setBilledValueCard] = useState({ cardValue: null, benchmark: null })
  const [billedValueChart, setBilledValueChart] = useState({ product_cat: [], order_value: [] })


  const fetchClients = async () => {
    try {
      const response = await apiService.filterdropdown();
      const clientData = response.customer_name || [];
      setClients(clientData);
      if (clientData.length > 0) {
        setSelectedClient(clientData[0].NAME1);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };
  const fetchBenchMark = async () => {
    //--------------------Bench Mark -----------------------
    const benchMarkResponse = await apiService.benchmarkShow();
    //console.log('data', benchMarkResponse);
    if (benchMarkResponse.status === "Success") {
      setBenchMarkData(benchMarkResponse.client)
      // console.log('BenchMarkData', benchMarkData);

    }
  }
  const fetchData = async () => {

    try {
      setLoading(true);

      //------------Late Payment Rate---------------
      const latePaymentRateResponse = await apiService.LatePaymentRate();
      setLatePaymentRateData(latePaymentRateResponse.LatePaymentRate_Forecast)
      if (latePaymentRateResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData) {
        const filteredLPR = filterByDateAndCustomer(latePaymentRateResponse.LatePaymentRate_Forecast, selectedDate, selectedClient)
        const persentageLPR = calculateAveragePercentage(filteredLPR, 'LatePaymentRate')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'LatePaymentRate_Forecast')
        const benchMark = persentageLPR >= filteredBenchMark ? 'high' : 'low'
        setLatePaymentRateCard({ cardValue: persentageLPR, benchmark: benchMark })
      }

      //--------------------Invoice Processing Time----------------------------
      const invoiceProcessingTimeResponse = await apiService.InvoiceProcessingTime();
      setInvoiceProcessingTimeData(invoiceProcessingTimeResponse.InvoiceProcessingTime_Forecast)
      if (invoiceProcessingTimeResponse.status === 'success' && selectedClient !== '' && selectedDate) {
        const filteredIPT = filterByDateAndCustomer(invoiceProcessingTimeResponse.InvoiceProcessingTime_Forecast, selectedDate, selectedClient)
        const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
        setInvoiceProcessingTime({
          DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
          Delivary_Date: invoiceProcessingTimeResult.customer_name
        })
      }
      //-------------------Amount Invoiced per Plant-----------------------------
      const amountInvPerPlantResponse = await apiService.AmountInvPerPlant();
      setAmountInvPerPlantData(amountInvPerPlantResponse.AmountInvoicedperPlant_Forecast)
      if (amountInvPerPlantResponse.status === 'success' && selectedClient !== '' && selectedDate) {
        const filteredTAIP = filterByDateAndCustomer(amountInvPerPlantResponse.AmountInvoicedperPlant_Forecast, selectedDate, selectedClient)
        const amountInvPerPlantResult = calculateGroupByAverage(filteredTAIP, 'customer_name', 'Total_Amount_Invoiced');
        setAmountInvPerPlant({
          Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
          customer_name: amountInvPerPlantResult.customer_name
        });

      }
      //------------------Company_Wise_Total_Invoice_Amount---------(Table)
      const companywiseTotalInvoiceAmountResponse = await apiService.Company_Wise_Total_Invoice_Amount();
      setCompanywiseTotalInvoiceAmountData(companywiseTotalInvoiceAmountResponse.CompanyWiseTotalInvoiceAmount_Forecast)
      if (companywiseTotalInvoiceAmountResponse.status === 'success' && selectedClient !== '' && selectedDate) {
        const filteredTAIP = filterByDateAndCustomer(companywiseTotalInvoiceAmountResponse.CompanyWiseTotalInvoiceAmount_Forecast, selectedDate, selectedClient)
        setCompanywiseTotalInvoiceAmountFilter(filteredTAIP)
      }
      //-------------------Billed Value-------------------
      const billedValueResponse = await apiService.BilledValue();
      if (billedValueResponse.status === 'success' && selectedClient !== '' && selectedDate) {
        setBilledValueData(billedValueResponse.Build_Values_Forecast)
        const filteredBV = filterByDateAndCustomer(billedValueResponse.Build_Values_Forecast, selectedDate, selectedClient)
        const avarageBV = calculateAverage(filteredBV, 'OrderValue')
        setBilledValueCard({ cardValue: avarageBV, benchmark: 'high' })
        const avarageBVChart = calculateGroupByAverage(filteredBV, 'MATKL_Material_Category', 'OrderValue');
        setBilledValueChart({
          product_cat: avarageBVChart.MATKL_Material_Category,
          order_value: avarageBVChart.OrderValue
        });

      }

    } catch (error) {
      console.error('Error fetching Data', error.message);
    }
    finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClients()
    fetchBenchMark()
  }, []);

  useEffect(() => {
    const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
    setSelectedDate(formattedDataDate)
    fetchData();
    return () => {
    };
  }, [clients]);

  const handleDateChange = async (newValue) => {
    try {
      const formattedDataDate = dayjs(newValue).format('MMM YYYY');
      setSelectedDate(formattedDataDate);
      console.log('Selected date:', formattedDataDate);

      // ----------LPR------------
      const filteredLPR = filterByDateAndCustomer(latePaymentRateData, formattedDataDate, selectedClient)
      const persentageLPR = calculateAveragePercentage(filteredLPR, 'LatePaymentRate')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'LatePaymentRate_Forecast')
      const benchMark = persentageLPR >= filteredBenchMark ? 'high' : 'low'
      setLatePaymentRateCard({ cardValue: persentageLPR, benchmark: benchMark })
      //-------------IPT-------------------
      const filteredIPT = filterByDateAndCustomer(invoiceProcessingTimeData, formattedDataDate, selectedClient)
      const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
      setInvoiceProcessingTime({
        DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
        Delivary_Date: invoiceProcessingTimeResult.customer_name
      })
      //-------------IPP-------------------
      const filteredIPP = filterByDateAndCustomer(amountInvPerPlantData, formattedDataDate, selectedClient)
      const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
      setAmountInvPerPlant({
        Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
        customer_name: amountInvPerPlantResult.customer_name
      });
      //-------------TIA-------------------
      const filteredTIA = filterByDateAndCustomer(companywiseTotalInvoiceAmountData, formattedDataDate, selectedClient)
      setCompanywiseTotalInvoiceAmountFilter(filteredTIA)

      //-------------Billed Value---------------
      const filteredBV = filterByDateAndCustomer(billedValueData, formattedDataDate, selectedClient)
      const avarageBV = calculateAverage(filteredBV, 'OrderValue')
      setBilledValueCard({ cardValue: avarageBV, benchmark: 'high' })
      const avarageBVChart = calculateGroupByAverage(filteredBV, 'MATKL_Material_Category', 'OrderValue');
      setBilledValueChart({
        product_cat: avarageBVChart.MATKL_Material_Category,
        order_value: avarageBVChart.OrderValue
      });


    } catch (error) {
      console.error('Error fetching data for the selected date:', error.message);
    }
  };

  const handleClientChange = async (event) => {
    const selectedValue = event
    setSelectedClient(event);
    console.log('selected value :', selectedValue);

    if (selectedValue === "All" && selectedDate) {
      //-------------LPR-------------------
      const filteredLPR = filterByDate(latePaymentRateData, selectedDate)
      const persentageLPR = calculateAveragePercentage(filteredLPR, 'LatePaymentRate')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'LatePaymentRate_Forecast')
      const benchMark = persentageLPR >= filteredBenchMark ? 'high' : 'low'
      setLatePaymentRateCard({ cardValue: persentageLPR, benchmark: benchMark })
      //-------------IPT-------------------
      const filteredIPT = filterByDate(invoiceProcessingTimeData, selectedDate)
      const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
      setInvoiceProcessingTime({
        DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
        Delivary_Date: invoiceProcessingTimeResult.customer_name
      })

      //-------------IPP-------------------
      const filteredIPP = filterByDate(amountInvPerPlantData, selectedDate)
      const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
      setAmountInvPerPlant({
        Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
        customer_name: amountInvPerPlantResult.customer_name
      });

      //-------------TIA-------------------
      const filteredTIA = filterByDate(companywiseTotalInvoiceAmountData, selectedDate)
      setCompanywiseTotalInvoiceAmountFilter(filteredTIA)
      
      //-------------Billed Value---------------
      const filteredBV = filterByDate(billedValueData, selectedDate)
      const avarageBV = calculateAverage(filteredBV, 'OrderValue')
      setBilledValueCard({ cardValue: avarageBV, benchmark: 'high' })
      const avarageBVChart = calculateGroupByAverage(filteredBV, 'MATKL_Material_Category', 'OrderValue');
      setBilledValueChart({
        product_cat: avarageBVChart.MATKL_Material_Category,
        order_value: avarageBVChart.OrderValue
      });


    }
    else if (selectedProduct !== '' && selectedValue !== 'All') {

      //-------------LPR-------------------
      const filteredLPR = filterByDateCustomerProduct(latePaymentRateData, selectedDate, selectedValue, selectedProduct)
      const persentageLPR = calculateAveragePercentage(filteredLPR, 'LatePaymentRate')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'LatePaymentRate_Forecast')
      const benchMark = persentageLPR >= filteredBenchMark ? 'high' : 'low'
      setLatePaymentRateCard({ cardValue: persentageLPR, benchmark: benchMark })
      //-------------IPT-------------------
      const filteredIPT = filterByDateCustomerProduct(invoiceProcessingTimeData, selectedDate, selectedValue, selectedProduct)
      const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
      setInvoiceProcessingTime({
        DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
        Delivary_Date: invoiceProcessingTimeResult.customer_name
      })

      //-------------IPP-------------------
      const filteredIPP = filterByDateCustomerProduct(amountInvPerPlantData, selectedDate, selectedValue, selectedProduct)
      const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
      setAmountInvPerPlant({
        Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
        customer_name: amountInvPerPlantResult.customer_name
      });

      //-------------TIA-------------------
      const filteredTIA = filterByDateCustomerProduct(companywiseTotalInvoiceAmountData, selectedDate, selectedValue, selectedProduct)
      setCompanywiseTotalInvoiceAmountFilter(filteredTIA)

      //-------------Billed Value---------------
      const filteredBV = filterByDateCustomerProduct(billedValueData, selectedDate, selectedValue, selectedProduct)
      const avarageBV = calculateAverage(filteredBV, 'OrderValue')
      setBilledValueCard({ cardValue: avarageBV, benchmark: 'high' })
      const avarageBVChart = calculateGroupByAverage(filteredBV, 'MATKL_Material_Category', 'OrderValue');
      setBilledValueChart({
        product_cat: avarageBVChart.MATKL_Material_Category,
        order_value: avarageBVChart.OrderValue
      });



    }
    else {
      //-------------LPR-------------------
      const filteredLPR = filterByDateAndCustomer(latePaymentRateData, selectedDate, selectedValue)
      const persentageLPR = calculateAveragePercentage(filteredLPR, 'LatePaymentRate')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'LatePaymentRate_Forecast')
      const benchMark = persentageLPR >= filteredBenchMark ? 'high' : 'low'
      setLatePaymentRateCard({ cardValue: persentageLPR, benchmark: benchMark })

      //-------------IPT-------------------
      const filteredIPT = filterByDateAndCustomer(invoiceProcessingTimeData, selectedDate, selectedValue)
      const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
      setInvoiceProcessingTime({
        DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
        Delivary_Date: invoiceProcessingTimeResult.customer_name
      })
      //-------------IPP-------------------
      const filteredIPP = filterByDateAndCustomer(amountInvPerPlantData, selectedDate, selectedValue)
      const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
      setAmountInvPerPlant({
        Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
        customer_name: amountInvPerPlantResult.customer_name
      });
      //-------------TIA-------------------
      const filteredTIA = filterByDateAndCustomer(companywiseTotalInvoiceAmountData, selectedDate, selectedValue)
      setCompanywiseTotalInvoiceAmountFilter(filteredTIA)

      //-------------Billed Value---------------
      const filteredBV = filterByDateAndCustomer(billedValueData, selectedDate, selectedValue)
      const avarageBV = calculateAverage(filteredBV, 'OrderValue')
      setBilledValueCard({ cardValue: avarageBV, benchmark: 'high' })
      const avarageBVChart = calculateGroupByAverage(filteredBV, 'MATKL_Material_Category', 'OrderValue');
      setBilledValueChart({
        product_cat: avarageBVChart.MATKL_Material_Category,
        order_value: avarageBVChart.OrderValue
      });
    }

  };

  const productChange = (selectedValue) => {

    setSelectedProduct(selectedValue.target.value)
    const selectedProductCate = selectedValue.target.value
    console.log('selected value :', selectedProductCate);

    if (selectedClient !== "") {
      //-------------LPR-------------------
      const filteredLPR = filterByDateCustomerProduct(latePaymentRateData, selectedDate, selectedClient, selectedProductCate)
      const persentageLPR = calculateAveragePercentage(filteredLPR, 'LatePaymentRate')
      //setLatePaymentRateCard(persentageLPR)
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'LatePaymentRate_Forecast')
      const benchMark = persentageLPR >= filteredBenchMark ? 'high' : 'low'
      setLatePaymentRateCard({ cardValue: persentageLPR, benchmark: benchMark })
      //console.log('OrderFulfillmentAccuracyCard', OrderFulfillmentAccuracyCard);
      //-------------IPT-------------------
      const filteredIPT = filterByDateCustomerProduct(invoiceProcessingTimeData, selectedDate, selectedClient, selectedProductCate)
      const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
      setInvoiceProcessingTime({
        DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
        Delivary_Date: invoiceProcessingTimeResult.customer_name
      })

      //-------------IPP-------------------
      const filteredIPP = filterByDateCustomerProduct(amountInvPerPlantData, selectedDate, selectedClient, selectedProductCate)
      const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
      setAmountInvPerPlant({
        Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
        customer_name: amountInvPerPlantResult.customer_name
      });

      //-------------TIA-------------------
      const filteredTIA = filterByDateCustomerProduct(companywiseTotalInvoiceAmountData, selectedDate, selectedClient, selectedProductCate)
      setCompanywiseTotalInvoiceAmountFilter(filteredTIA)

      //-------------Billed Value---------------
      const filteredBV = filterByDateCustomerProduct(billedValueData, selectedDate, selectedClient,selectedProductCate)
      const avarageBV = calculateAverage(filteredBV, 'OrderValue')
      setBilledValueCard({ cardValue: avarageBV, benchmark: 'high' })
      const avarageBVChart = calculateGroupByAverage(filteredBV, 'MATKL_Material_Category', 'OrderValue');
      setBilledValueChart({
        product_cat: avarageBVChart.MATKL_Material_Category,
        order_value: avarageBVChart.OrderValue
      });

    }
    else {

    }
  };

  return (
    <Box m="20px" sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={3} md={3}>
          <Typography
            variant="h2"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 5px" }}
          >Billing</Typography>
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
            <InputLabel id="client-select-label">Customer Name</InputLabel>
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
              {showAllOption && (
                <MenuItem key="all-option" value="All">
                  All
                </MenuItem>
              )}
              {clients.map((client, i) => (
                <MenuItem key={i} value={client.NAME1}>
                  {client.NAME1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} md={3}>
          {/* <ProductSelect product_change={productChange} /> */}
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={4} md={4}>
        <GlobalCard
              title="Late Payment Rate"
              subtitle={loading ? 'Loading...' : latePaymentRateCard.cardValue?.toString() ?? '0'}
              units={loading ? null : '%'}
              benchmark={loading ? null : latePaymentRateCard.benchmark}
            />
        </Grid>
        <Grid item xs={4} md={4}>
         <GlobalCard
              currency={loading ? null : '₹'}
              title="Total Billled Value"
              subtitle={loading ? 'Loading...' : billedValueCard.cardValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '0'}
              benchmark={loading ? null : billedValueCard.benchmark}
            />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={5} md={5}>
          <label>Total Billed Value per Product Category</label>
          <PieCharts
            series={billedValueChart.order_value}
            labels={billedValueChart.product_cat}
            height="300"
          />
        </Grid>
        <Grid item xs={7} md={7}>
          <label>Total Amount Invoiced per Customer</label>
          <BarCharts
            series={amountInvPerPlant.Total_Amount_Invoiced}
            labels={amountInvPerPlant.customer_name}
            height="350"
            legend='Total Amount Invoiced (₹)'
            format_func={formatRuppes}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={6} md={6}>
          <label>Invoice Processing Time per Customer</label>
          <DistributedColumnChart
            series={invoiceProcessingTime.DaysToComplete}
            labels={invoiceProcessingTime.Delivary_Date}
            height="350"
            format_func={formatDays}
          />
        </Grid>
        <Grid item xs={6} md={6}>
          <CompanyWiseTotalInvoiceAmount table_data={companywiseTotalInvoiceAmountFilter} />
        </Grid>
      </Grid>

      <SimpleBackdrop open={loading} handleClose={() => { }} size={80} />
    </Box>
  );
};

export default Billing;