import { Box, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Grid from '@mui/material/Unstable_Grid2';
import GlobalCard from "../../../components/GlobalCard";
import { useEffect, useState } from 'react';
import { apiService } from '../../../service/api-service';
import BarCharts from "../../../components/charts/Barchart";
import SimpleBackdrop from "../../../scenes/global/Loader";
//----------------------For Date filter -------------------------------
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {

  calculateGroupByAverage,
  calculateAveragePercentage,
  calculateAverage,
  formatPersentage,
  filterBenchMarkData,
  filterByDate,
  filterByDateAndCustomer,
  filterByDateAndCustomerALT,
  filterByDateAndCustomerN,
  filterByDateCustomerProduct,
  filterByDateCustomerProductALT,
  filterByDateCustomerProductN
} from "../../../utils/GlobalFilters";


const Collection = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //------------Cash To Cash Cycle Time---------------
  const [CashToCashCycleTimeData, setCashToCashCycleTimeData] = useState([])
  const [AverageCashToCashCycleTimeCard, setAverageCashToCashCycleTimeCard] = useState({ cardValue: null, benchmark: null })
  //-------------------Product Return Rate ------------------------
  const [productReturnRateData, setProductReturnRateData] = useState([])
  const [productReturnRateeCard, setproductReturnRateeCard] = useState({ cardValue: null, benchmark: null })
  const [ProductReturnRateValue, setProductReturnRateValue] = useState([]);
  const [YearValue, setYearValue] = useState([]);
  const [ProductReturnRateByYear, setProductReturnRateByYear] = useState({ ProductReturnRate: [], MTEXT_ClientName: [] })
  //-------------------Perfect Order Rate------------------------
  const [perfectOrderRateData, setPerfectOrderRateData] = useState([])
  const [perfectOrderRateCard, setPerfectOrderRateCard] = useState({ cardValue: null, benchmark: null })
  //-------------------------Order To Cash Cycle Time ------------
  const [OrderToCashCycleTimeData, setOrderToCashCycleTimeData] = useState([])
  const [OrderToCashCycleTimeCard, setOrderToCashCycleTimeCard] = useState({ cardValue: null, benchmark: null })
  //------------------------- Procurement Cost Savings -----------------
  const [ProcurementCostSavingsData, setProcurementCostSavingsData] = useState([])
  const [ProcurementCostSavingsCard, setProcurementCostSavingsCard] = useState({ cardValue: null, benchmark: null })
  //------------------------- Transportation Cost of Revenue ---------------------------
  const [TransportationCostofRevenueData, setTransportationCostofRevenueData] = useState([])
  const [TransportationCostofRevenueCard, setTransportationCostofRevenueCard] = useState({ cardValue: null, benchmark: null })
  //-------------------- Bench mark----------------
  const [benchMarkData, setBenchMarkData] = useState([])

  const [loading, setLoading] = useState(false);

  //----------------------For Date filter -------------------------------
  const [selectedDate, setSelectedDate] = useState('');
  const [monthYear, setmonthYear] = useState('Select month and year')
  const currentDate = new Date();

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('')

  const [showAllOption, setShowAllOption] = useState(true); // For ALL


  const fetchBenchMark = async () => {
    //--------------------Bench Mark -----------------------
    const benchMarkResponse = await apiService.benchmarkShow();
    //console.log('data', benchMarkResponse);
    if (benchMarkResponse.status === "Success") {
      setBenchMarkData(benchMarkResponse.client)

    }
    console.log('BenchMarkData', benchMarkData);

  }

  useEffect(() => {
    fetchBenchMark()
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);

      //-------------------------Cash To Cash Cycle Time---------------------------
      const CashToCashCycleTimeResponse = await apiService.CashToCashCycleTime();
      setCashToCashCycleTimeData(CashToCashCycleTimeResponse.CashtocashCycleTime)
      // console.log("CCT ", CashToCashCycleTimeData);
      if (CashToCashCycleTimeResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData) {
        const filteredIPT = filterByDateAndCustomerALT(CashToCashCycleTimeData, selectedDate, selectedClient)
        // const filteredALT = dateFormationDataKey(AverageLeadTimeForecastResponse.CashtocashCycleTime).filter(obj => obj.Date_Module === formattedDataDate && obj.MTEXT_ClientName === selectedClient);
        const AverageCTCCT = calculateAverage(filteredIPT, 'CashToCashCycleTime')
        console.log("CCT SUM", filteredIPT);
        //setAverageCashToCashCycleTimeCard(AverageCTCCT)
        console.log("Average", AverageCTCCT);
        const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
        const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
        setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })
        //console.log('AverageCashToCashCycleTimeCard', AverageCashToCashCycleTimeCard);


      }


      //------------Product Return Rate---------------
      const productReturnRateResponse = await apiService.ProductReturnRate();
      setProductReturnRateData(productReturnRateResponse.ProductReturnRate)
      // console.log("CCT ", productReturnRateResponse.status);

      if (productReturnRateResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData) {
        // const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
        const filteredPRR = filterByDateAndCustomer(productReturnRateData, selectedDate, selectedClient)
        const persentagePRR = calculateAveragePercentage(filteredPRR, 'ProductReturnRate')
        // console.log("CCT ", filteredPRR);

        //setproductReturnRateeCard(persentagePRR)
        const filteredBenchMarkPRR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
        const benchMarkPRR = persentagePRR >= filteredBenchMarkPRR ? 'high' : 'low'
        setproductReturnRateeCard({ cardValue: persentagePRR, benchmark: benchMarkPRR })
        //console.log('productReturnRateeCard', productReturnRateeCard);


      }

      //-------------------------Order To Cash Cycle Time ---------------------------
      const OrderToCashCycleTimeResponse = await apiService.OrderToCashCycleTime();
      setOrderToCashCycleTimeData(OrderToCashCycleTimeResponse.OrderToCashCycleTime)
      // console.log("Order To Cash Cycle Time ", OrderToCashCycleTimeData);

      if (OrderToCashCycleTimeResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData) {
        // const filteredOTCCT = filterByDateAndClient(OrderToCashCycleTimeResponse.OrderToCashCycleTime, selectedDate, selectedClient)
        const filteredOTCCT = filterByDateAndCustomer(OrderToCashCycleTimeData, selectedDate, selectedClient)
        const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
        // console.log("CCT SUM", filteredOTCCT);
        // setOrderToCashCycleTimeCard(averageOTCCT)
        const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
        const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
        setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
        //console.log('OrderToCashCycleTimeCard', OrderToCashCycleTimeCard);
      }

      //------------Perfect Order Rate---------------
      const perfectOrderRateResponse = await apiService.PerfectOrderRateForecast();
      setPerfectOrderRateData(perfectOrderRateResponse.Perfect_Order_Rate_Forecast)
      // console.log("Perfect Order Rate", perfectOrderRateResponse.Perfect_Order_Rate_Forecast);

      if (perfectOrderRateResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData) {
        // const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
        const filteredPOR = filterByDateAndCustomer(perfectOrderRateData, selectedDate, selectedClient)
        const persentagePOR = calculateAveragePercentage(filteredPOR, 'Perfect_Order_Rate')
        // console.log("Perfect Order Rate fill", filteredPOR);

        setPerfectOrderRateCard(persentagePOR)
        const filteredBenchMarkPOR = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
        const benchMarkOFR = persentagePOR >= filteredBenchMarkPOR ? 'high' : 'low'
        setPerfectOrderRateCard({ cardValue: persentagePOR, benchmark: benchMarkOFR })
        //console.log('PerfectOrderRateCard', PerfectOrderRateCard);
      }

      //------------------------- Procurement Cost Savings ---------------------------
      const ProcurementCostSavingsResponse = await apiService.ProcurementCostSavings();
      setProcurementCostSavingsData(ProcurementCostSavingsResponse.ProcurementCostSavings_Forecast)
      // console.log("CCT ", ProcurementCostSavingsResponse.ProcurementCostSavings_Forecast);
      if (ProcurementCostSavingsResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData) {
        const filteredPCS = filterByDateAndCustomerALT(ProcurementCostSavingsResponse.ProcurementCostSavings_Forecast, selectedDate, selectedClient)
        const averagePCS = calculateAverage(filteredPCS, 'Procurement_Cost_Savings')
        // console.log("CCT SUM", filteredIPT);
        //setProcurementCostSavingsCard(averagePCS)
        const filteredBenchMarkPCS = filterBenchMarkData(benchMarkData, 'Procurement_Cost_Savings')
        const benchMarkPCS = averagePCS >= filteredBenchMarkPCS ? 'high' : 'low'
        setProcurementCostSavingsCard({ cardValue: averagePCS, benchmark: benchMarkPCS })
        //console.log('OrderFillRateForecastCard', OrderFillRateForecastCard);
      }

      //------------------------- Transportation Cost of Revenue ---------------------------
      const TransportationCostofRevenueResponse = await apiService.TransportationCostofRevenue();
      setTransportationCostofRevenueData(TransportationCostofRevenueResponse.TransportationCostofRevenue_Forecast)
      // console.log("Transportation Cost Revenue ", TransportationCostofRevenueResponse.TransportationCostofRevenue_Forecast);

      if (TransportationCostofRevenueResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData) {
        const filteredTCOR = filterByDateAndCustomerN(TransportationCostofRevenueData, selectedDate, selectedClient)
        const averageTCOR = calculateAverage(filteredTCOR, 'Transportation_Cost_as_a_Percentage_of_Revenue')
        // console.log("CCT SUM", filteredTCOR);
        //setTransportationCostofRevenueCard(avarageTCOR)
        const filteredBenchMarkTCOR = filterBenchMarkData(benchMarkData, 'Transportation_Cost_as_a_Percentage_of_Revenue')
        const benchMarkTCOR = averageTCOR >= filteredBenchMarkTCOR ? 'high' : 'low'
        setTransportationCostofRevenueCard({ cardValue: averageTCOR, benchmark: benchMarkTCOR })
        //console.log('TransportationCostofRevenueCard', TransportationCostofRevenueCard);
      }

      //--------------------Product Return Rate by Year ----------------------------
      const ProductReturnRatebyYearResponse = await apiService.ProductReturnRate();
      setProductReturnRateData(ProductReturnRatebyYearResponse.ProductReturnRate)
      // console.log("ProductReturnRatebyYearResponse",ProductReturnRatebyYearResponse.ProductReturnRate);
      if (ProductReturnRatebyYearResponse.status === 'success') {
        const filteredPRRY = filterByDateAndCustomer(productReturnRateData, selectedDate, selectedClient)
        const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
        // console.log("productReturnRatebyYearResult", filteredPRRY);
        setProductReturnRateByYear({
          ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
          MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
        })
      }

    } catch (error) {
      // console.error('Error fetching data:', error.message);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    // console.log("ProductReturnRateValue2", ProductReturnRateValue);
  }, [ProductReturnRateValue]);

  useEffect(() => {
  }, [YearValue]);

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

  useEffect(() => {
    fetchClients()
  }, []);

  useEffect(() => {
    const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
    setSelectedDate(formattedDataDate)
    setmonthYear('Selected month and year')
    fetchData();
    return () => {
    };
  }, [clients]);

  const handleDateChange = async (newValue) => {
    try {
      const formattedDataDate = dayjs(newValue).format('MMM YYYY');
      setmonthYear('Selected month and year')
      setSelectedDate(formattedDataDate);
      console.log('Selected date:', formattedDataDate);

      //-------------------------Cash To Cash Cycle Time---------------------------
      const filteredCTCCT = filterByDateAndCustomerALT(CashToCashCycleTimeData, formattedDataDate, selectedClient)
      const AverageCTCCT = calculateAverage(filteredCTCCT, 'CashToCashCycleTime')
  
      const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
      setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })

      //------------Product Return Rate---------------
  
      const filteredLPRR = filterByDateAndCustomer(productReturnRateData, formattedDataDate, selectedClient)
      const persentagePRR = calculateAveragePercentage(filteredLPRR, 'ProductReturnRate')
      const filteredBenchMarkPRR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMarkPRR = persentagePRR >= filteredBenchMarkPRR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePRR, benchmark: benchMarkPRR })


      //------------Order To Cash Cycle Time --------------
      const filteredOTCCT = filterByDateAndCustomer(OrderToCashCycleTimeData, formattedDataDate, selectedClient)
      const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
      const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
      const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
      setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
    
      //------------ Perfect Order Rate ---------------
      const filteredPOR = filterByDateAndCustomer(perfectOrderRateData, formattedDataDate, selectedClient)
      const persentagePOR = calculateAveragePercentage(filteredPOR, 'Perfect_Order_Rate')
      const filteredBenchMarkPOR = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkOFR = persentagePOR >= filteredBenchMarkPOR ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePOR, benchmark: benchMarkOFR })
 
      //--------------Procurement Cost Savings --------------
      const filteredPCS = filterByDateAndCustomerALT(ProcurementCostSavingsData, formattedDataDate, selectedClient)
      const averagePCS = calculateAverage(filteredPCS, 'Procurement_Cost_Savings')
      const filteredBenchMarkPCS = filterBenchMarkData(benchMarkData, 'Procurement_Cost_Savings')
      const benchMarkPCS = averagePCS >= filteredBenchMarkPCS ? 'high' : 'low'
      setProcurementCostSavingsCard({ cardValue: averagePCS, benchmark: benchMarkPCS })

      //----------------Transportation Cost of Revenue --------------
      const filteredTCOR = filterByDateAndCustomerN(TransportationCostofRevenueData, formattedDataDate, selectedClient)
      const averageTCOR = calculateAverage(filteredTCOR, 'Transportation_Cost_as_a_Percentage_of_Revenue')
      const filteredBenchMarkTCOR = filterBenchMarkData(benchMarkData, 'Transportation_Cost_as_a_Percentage_of_Revenue')
      const benchMarkTCOR = averageTCOR >= filteredBenchMarkTCOR ? 'high' : 'low'
      setTransportationCostofRevenueCard({ cardValue: averageTCOR, benchmark: benchMarkTCOR })

      //--------------------Product Return Rate by Year ----------------------------
      const filteredPRRY = filterByDateAndCustomer(productReturnRateData, selectedDate, selectedClient)
      const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
      setProductReturnRateByYear({
        ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
        MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
      })


    } catch (error) {
      console.error('Error fetching data for the selected date:', error.message);
    }
  };


  const handleClientChange = async (event) => {
    const selectedValue = event
    setSelectedClient(event);

    if (selectedValue === "All" && selectedDate) {

      //-------------------------Cash To Cash Cycle Time---------------------------
      const filteredCTCCT = filterByDate(CashToCashCycleTimeData, selectedDate)
      const AverageCTCCT = calculateAverage(filteredCTCCT, 'CashToCashCycleTime')
      const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
      setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })

      //------------Product Return Rate---------------
      const filteredPRR = filterByDate(productReturnRateData, selectedDate)
      const persentagePRR = calculateAveragePercentage(filteredPRR, 'ProductReturnRate')
      //setproductReturnRateeCard(persentagePRR)
      const filteredBenchMarkPRR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMarkPRR = persentagePRR >= filteredBenchMarkPRR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePRR, benchmark: benchMarkPRR })
      //console.log('productReturnRateeCard', productReturnRateeCard);


      //------------Order To Cash Cycle Time --------------
      const filteredOTCCT = filterByDate(OrderToCashCycleTimeData, selectedDate)
      const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
      //setOrderToCashCycleTimeCard(averageOTCCT)
      const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
      const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
      setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
      //console.log('OrderToCashCycleTimeCard', OrderToCashCycleTimeCard);

      //------------ Perfect Order Rate ---------------
      const filteredPOR = filterByDate(perfectOrderRateData, selectedDate)
      const persentagePOR = calculateAveragePercentage(filteredPOR, 'Perfect_Order_Rate')
      //setPerfectOrderRateCard(persentagePOR)
      const filteredBenchMarkPOR = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkOFR = persentagePOR >= filteredBenchMarkPOR ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePOR, benchmark: benchMarkOFR })
      //console.log('PerfectOrderRateCard', PerfectOrderRateCard);

      //--------------Procurement Cost Savings --------------
      const filteredPCS = filterByDate(ProcurementCostSavingsData, selectedDate)
      const averagePCS = calculateAverage(filteredPCS, 'Procurement_Cost_Savings')
      //setProcurementCostSavingsCard(averagePCS)
      const filteredBenchMarkPCS = filterBenchMarkData(benchMarkData, 'Procurement_Cost_Savings')
      const benchMarkPCS = averagePCS >= filteredBenchMarkPCS ? 'high' : 'low'
      setProcurementCostSavingsCard({ cardValue: averagePCS, benchmark: benchMarkPCS })
      //console.log('OrderFillRateForecastCard', OrderFillRateForecastCard);

      //----------------Transportation Cost of Revenue --------------
      const filteredTCOR = filterByDate(TransportationCostofRevenueData, selectedDate)
      const averageTCOR = calculateAverage(filteredTCOR, 'Transportation_Cost_as_a_Percentage_of_Revenue')
      //setTransportationCostofRevenueCard(averageTCOR)
      const filteredBenchMarkTCOR = filterBenchMarkData(benchMarkData, 'Transportation_Cost_as_a_Percentage_of_Revenue')
      const benchMarkTCOR = averageTCOR >= filteredBenchMarkTCOR ? 'high' : 'low'
      setTransportationCostofRevenueCard({ cardValue: averageTCOR, benchmark: benchMarkTCOR })
      //console.log('TransportationCostofRevenueCard', TransportationCostofRevenueCard);

      //--------------------Product Return Rate by Year ----------------------------
      const filteredPRRY = filterByDate(productReturnRateData, selectedDate)
      const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'customer_name', 'ProductReturnRate');
      setProductReturnRateByYear({
        ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
        MTEXT_ClientName: productReturnRatebyYearResult.customer_name
      })


    }

    else if (selectedProduct !== '' && selectedValue !== 'All') {

      //-------------------------Cash To Cash Cycle Time---------------------------
      const filteredCTCCT = filterByDateCustomerProductALT(CashToCashCycleTimeData, selectedDate, selectedValue, selectedProduct)
      const AverageCTCCT = calculateAverage(filteredCTCCT, 'CashToCashCycleTime')
      //setAverageCashToCashCycleTimeCard(AverageCTCCT)
      const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
      setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })
      //console.log('AverageCashToCashCycleTimeCard', AverageCashToCashCycleTimeCard);

      //------------Product Return Rate---------------
      const filteredPRR = filterByDateCustomerProduct(productReturnRateData, selectedDate, selectedValue, selectedProduct)
      const persentagePRR = calculateAveragePercentage(filteredPRR, 'ProductReturnRate')
      //setproductReturnRateeCard(persentagePRR)
      const filteredBenchMarkPRR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMarkPRR = persentagePRR >= filteredBenchMarkPRR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePRR, benchmark: benchMarkPRR })
      //console.log('productReturnRateeCard', productReturnRateeCard);


      //------------Order To Cash Cycle Time --------------
      const filteredOTCCT = filterByDateCustomerProduct(OrderToCashCycleTimeData, selectedDate, selectedValue, selectedProduct)
      const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
      //setOrderToCashCycleTimeCard(averageOTCCT)
      const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
      const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
      setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
      //console.log('OrderToCashCycleTimeCard', OrderToCashCycleTimeCard);

      //------------ Perfect Order Rate ---------------
      const filteredPOR = filterByDateCustomerProduct(perfectOrderRateData, selectedDate, selectedValue, selectedProduct)
      const persentagePOR = calculateAveragePercentage(filteredPOR, 'Perfect_Order_Rate')
      //setPerfectOrderRateCard(persentagePOR)
      const filteredBenchMarkPOR = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkOFR = persentagePOR >= filteredBenchMarkPOR ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePOR, benchmark: benchMarkOFR })
      //console.log('PerfectOrderRateCard', PerfectOrderRateCard);

      //--------------Procurement Cost Savings --------------
      const filteredPCS = filterByDateCustomerProductALT(ProcurementCostSavingsData, selectedDate, selectedValue, selectedProduct)
      const averagePCS = calculateAverage(filteredPCS, 'Procurement_Cost_Savings')
      //setProcurementCostSavingsCard(averagePCS)
      const filteredBenchMarkPCS = filterBenchMarkData(benchMarkData, 'Procurement_Cost_Savings')
      const benchMarkPCS = averagePCS >= filteredBenchMarkPCS ? 'high' : 'low'
      setProcurementCostSavingsCard({ cardValue: averagePCS, benchmark: benchMarkPCS })
      //console.log('OrderFillRateForecastCard', OrderFillRateForecastCard);

      //----------------Transportation Cost of Revenue --------------
      const filteredTCOR = filterByDateCustomerProductN(TransportationCostofRevenueData, selectedDate, selectedValue, selectedProduct)
      const averageTCOR = calculateAverage(filteredTCOR, 'Transportation_Cost_as_a_Percentage_of_Revenue')
      //setTransportationCostofRevenueCard(averageTCOR)
      const filteredBenchMarkTCOR = filterBenchMarkData(benchMarkData, 'Transportation_Cost_as_a_Percentage_of_Revenue')
      const benchMarkTCOR = averageTCOR >= filteredBenchMarkTCOR ? 'high' : 'low'
      setTransportationCostofRevenueCard({ cardValue: averageTCOR, benchmark: benchMarkTCOR })
      //console.log('TransportationCostofRevenueCard', TransportationCostofRevenueCard);

      //--------------------Product Return Rate by Year ----------------------------
      const filteredPRRY = filterByDateCustomerProduct(productReturnRateData, selectedDate, selectedValue, selectedProduct)
      const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'customer_name', 'ProductReturnRate');
      setProductReturnRateByYear({
        ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
        MTEXT_ClientName: productReturnRatebyYearResult.customer_name
      })


    }
    else {
      //-------------------------Cash To Cash Cycle Time---------------------------
      const filteredCTCCT = filterByDateAndCustomerALT(CashToCashCycleTimeData, selectedDate, selectedValue)
      const AverageCTCCT = calculateAverage(filteredCTCCT, 'CashToCashCycleTime')
      //setAverageCashToCashCycleTimeCard(AverageCTCCT)
      const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
      setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })
      //console.log('AverageCashToCashCycleTimeCard', AverageCashToCashCycleTimeCard);

      //------------Product Return Rate---------------
      const filteredPRR = filterByDateAndCustomer(productReturnRateData, selectedDate, selectedValue)
      const persentagePRR = calculateAveragePercentage(filteredPRR, 'ProductReturnRate')
      //setproductReturnRateeCard(persentagePRR)
      const filteredBenchMarkPRR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMarkPRR = persentagePRR >= filteredBenchMarkPRR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePRR, benchmark: benchMarkPRR })
      //console.log('productReturnRateeCard', productReturnRateeCard);


      //------------Order To Cash Cycle Time --------------
      const filteredOTCCT = filterByDateAndCustomer(OrderToCashCycleTimeData, selectedDate, selectedValue)
      const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
      //setOrderToCashCycleTimeCard(averageOTCCT)
      const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
      const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
      setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
      //console.log('OrderToCashCycleTimeCard', OrderToCashCycleTimeCard);

      //------------ Perfect Order Rate ---------------
      const filteredPOR = filterByDateAndCustomer(perfectOrderRateData, selectedDate, selectedValue)
      const persentagePOR = calculateAveragePercentage(filteredPOR, 'Perfect_Order_Rate')
      //setPerfectOrderRateCard(persentagePOR)
      const filteredBenchMarkPOR = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkOFR = persentagePOR >= filteredBenchMarkPOR ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePOR, benchmark: benchMarkOFR })
      //console.log('PerfectOrderRateCard', PerfectOrderRateCard);

      //--------------Procurement Cost Savings --------------
      const filteredPCS = filterByDateAndCustomerALT(ProcurementCostSavingsData, selectedDate, selectedValue)
      const averagePCS = calculateAverage(filteredPCS, 'Procurement_Cost_Savings')
      //setProcurementCostSavingsCard(averagePCS)
      const filteredBenchMarkPCS = filterBenchMarkData(benchMarkData, 'Procurement_Cost_Savings')
      const benchMarkPCS = averagePCS >= filteredBenchMarkPCS ? 'high' : 'low'
      setProcurementCostSavingsCard({ cardValue: averagePCS, benchmark: benchMarkPCS })
      //console.log('OrderFillRateForecastCard', OrderFillRateForecastCard);

      //----------------Transportation Cost of Revenue --------------
      const filteredTCOR = filterByDateAndCustomerN(TransportationCostofRevenueData, selectedDate, selectedValue)
      const averageTCOR = calculateAverage(filteredTCOR, 'Transportation_Cost_as_a_Percentage_of_Revenue')
      //setTransportationCostofRevenueCard(averageTCOR)
      const filteredBenchMarkTCOR = filterBenchMarkData(benchMarkData, 'Transportation_Cost_as_a_Percentage_of_Revenue')
      const benchMarkTCOR = averageTCOR >= filteredBenchMarkTCOR ? 'high' : 'low'
      setTransportationCostofRevenueCard({ cardValue: averageTCOR, benchmark: benchMarkTCOR })
      //console.log('TransportationCostofRevenueCard', TransportationCostofRevenueCard);

      //--------------------Product Return Rate by Year ----------------------------
      const filteredPRRY = filterByDateAndCustomer(productReturnRateData, selectedDate, selectedValue)
      const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'customer_name', 'ProductReturnRate');
      setProductReturnRateByYear({
        ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
        MTEXT_ClientName: productReturnRatebyYearResult.customer_name
      })

    }

  };

  const productChange = (selectedValue) => {

    setSelectedProduct(selectedValue.target.value)
    const selectedProductCate = selectedValue.target.value

    if (selectedClient !== "") {
      //-------------------------Cash To Cash Cycle Time---------------------------
      const filteredCTCCT = filterByDateCustomerProductALT(CashToCashCycleTimeData, selectedDate, selectedClient, selectedProductCate)
      const AverageCTCCT = calculateAverage(filteredCTCCT, 'CashToCashCycleTime')
      // setAverageCashToCashCycleTimeCard(AverageCTCCT)
      const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
      setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })
      //console.log('AverageCashToCashCycleTimeCard', AverageCashToCashCycleTimeCard);

      //------------Order To Cash Cycle Time --------------
      const filteredOTCCT = filterByDateCustomerProduct(OrderToCashCycleTimeData, selectedDate, selectedClient, selectedProductCate)
      const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
      //setOrderToCashCycleTimeCard(averageOTCCT)
      const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
      const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
      setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
      //console.log('OrderToCashCycleTimeCard', OrderToCashCycleTimeCard);

      //------------ Perfect Order Rate ---------------
      const filteredPOR = filterByDateCustomerProduct(perfectOrderRateData, selectedDate, selectedClient, selectedProductCate)
      const persentagePOR = calculateAveragePercentage(filteredPOR, 'Perfect_Order_Rate')
      //setPerfectOrderRateCard(persentagePOR)
      const filteredBenchMarkPOR = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkOFR = persentagePOR >= filteredBenchMarkPOR ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePOR, benchmark: benchMarkOFR })
      //console.log('PerfectOrderRateCard', PerfectOrderRateCard);


      //--------------Procurement Cost Savings --------------
      const filteredPCS = filterByDateCustomerProductALT(ProcurementCostSavingsData, selectedDate, selectedClient, selectedProductCate)
      const averagePCS = calculateAverage(filteredPCS, 'Procurement_Cost_Savings')
      //setProcurementCostSavingsCard(averagePCS)
      const filteredBenchMarkPCS = filterBenchMarkData(benchMarkData, 'Procurement_Cost_Savings')
      const benchMarkPCS = averagePCS >= filteredBenchMarkPCS ? 'high' : 'low'
      setProcurementCostSavingsCard({ cardValue: averagePCS, benchmark: benchMarkPCS })
      //console.log('OrderFillRateForecastCard', OrderFillRateForecastCard);


      //----------------Transportation Cost of Revenue --------------
      const filteredTCOR = filterByDateCustomerProductN(TransportationCostofRevenueData, selectedDate, selectedClient, selectedProductCate)
      const averageTCOR = calculateAverage(filteredTCOR, 'Transportation_Cost_as_a_Percentage_of_Revenue')
      //setTransportationCostofRevenueCard(averageTCOR)
      const filteredBenchMarkTCOR = filterBenchMarkData(benchMarkData, 'Transportation_Cost_as_a_Percentage_of_Revenue')
      const benchMarkTCOR = averageTCOR >= filteredBenchMarkTCOR ? 'high' : 'low'
      setTransportationCostofRevenueCard({ cardValue: averageTCOR, benchmark: benchMarkTCOR })
      //console.log('TransportationCostofRevenueCard', TransportationCostofRevenueCard);

      //--------------------Product Return Rate by Year ----------------------------
      const filteredPRRY = filterByDateCustomerProduct(productReturnRateData, selectedDate, selectedClient, selectedProductCate)
      const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
      console.log("productReturnRatebyYearResult", productReturnRatebyYearResult);
      setProductReturnRateByYear({
        ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
        MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
      })
    }
    else {
      console.log('data else',);
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
          >Collection</Typography>
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

      <Grid container spacing={2}>
        <Grid xs={4}>
          <GlobalCard
              title="Cash To Cash Cycle Time"
              subtitle={loading ? 'Loading...' : AverageCashToCashCycleTimeCard.cardValue?.toString() ?? '0'}
              units={loading ? null : 'Days'}
              benchmark={loading ? null : AverageCashToCashCycleTimeCard.benchmark}
            />
        </Grid>

        <Grid xs={4}>
         <GlobalCard
              title="Product Return Rate"
              subtitle={loading ? 'Loading...' : productReturnRateeCard.cardValue?.toString() ?? '0'}
              units={loading ? null : '%'}
              benchmark={loading ? null : productReturnRateeCard.benchmark}
            />
        </Grid>

        <Grid xs={4}>
          <GlobalCard
              title="Order To Cash Cycle Time"
              subtitle={loading ? 'Loading...' : OrderToCashCycleTimeCard.cardValue?.toString() ?? '0'}
              units={loading ? null : 'Days'}
              benchmark={loading ? null : OrderToCashCycleTimeCard.benchmark}
            />
        </Grid>

        <Grid xs={4}>
         <GlobalCard
              title="Perfect Order Rate"
              subtitle={loading ? 'Loading...' : perfectOrderRateCard.cardValue?.toString() ?? '0'}
              units={loading ? null : '%'}
              benchmark={loading ? null : perfectOrderRateCard.benchmark}
            />
        </Grid>

        <Grid xs={4}>
          <GlobalCard
              currency={loading ? null : '₹'}
              title="Procurement Cost Savings"
              subtitle={loading ? 'Loading...' : ProcurementCostSavingsCard.cardValue?.toString() ?? '0'}
              benchmark={loading ? null : ProcurementCostSavingsCard.benchmark}
            />
        </Grid>

        <Grid xs={4}>
         <GlobalCard
              currency={loading ? null : '₹'}
              title="Transportation Cost of Revenue"
              subtitle={loading ? 'Loading...' : TransportationCostofRevenueCard.cardValue?.toString() ?? '0'}
              benchmark={loading ? null : TransportationCostofRevenueCard.benchmark}
            />
        </Grid>

        <Grid xs={6}>
          <label>Product Return Rate by Year</label>
          <BarCharts
            labels={ProductReturnRateByYear.MTEXT_ClientName}
            series={ProductReturnRateByYear.ProductReturnRate}
            format_func={formatPersentage}
            height='350' />
        </Grid>

      </Grid>
      <SimpleBackdrop open={loading} handleClose={() => { }} size={80} />
    </Box>
  );
};

export default Collection;
