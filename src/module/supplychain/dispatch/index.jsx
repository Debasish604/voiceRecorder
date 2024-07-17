import { Box, useTheme, Grid, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { useState, useEffect } from "react";
import GlobalCard from "../../../components/GlobalCard";
import DonutCharts from "../../../components/charts/DonutChart";
import { apiService } from '../../../service/api-service';
// import BarCharts from "../../../components/charts/Barchart";
import SimpleBackdrop from "../../../scenes/global/Loader";
import {
  calculateGroupBySum,
  // formatDays,
  calculateGroupByAverage,
  calculateAveragePercentage,
  // calculateAverage,
  filterByDate,
  filterBenchMarkData,
  filterDateCustomer,
  filterByDateAndCustomerSAP,
  filterDateCustomerProduct,
  filterDateCustomerProductSAP,
  formatQuantity,
  filterByDateProduct
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
import { useLocation } from 'react-router-dom';
import DistributedColumnChart from "../../../components/charts/DistributedColumnChart";

const DispatchSupplychain = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('')
  const [products, setproducts] = useState([]);


  //----------------------For Date filter -------------------------------
  const [selectedDate, setSelectedDate] = useState('');
  const [monthYear, setmonthYear] = useState('Select month and year')
  const currentDate = new Date();
  const showAllOption = true; // or false, depending on your requirement

  //-------------------- Bench mark----------------
  const [benchMarkData, setBenchMarkData] = useState([])

  //--------------------OrderFillRateForecast----------------
  const [OrderFillRateForecastData, setOrderFillRateForecastData] = useState([])
  const [OrderFillRateForecastCard, setOrderFillRateForecastCard] = useState({ cardValue: null, benchmark: null })

  const [OrderFillRateChart, setOrderFillRateChart] = useState({ matkl_material_category: [], orderfillrate: [] })

  //--------------------On-Time Delivery Performance----------------
  const [OnTimeDeliveryPerformanceData, setOnTimeDeliveryPerformanceData] = useState([])
  const [OnTimeDeliveryPerformanceCard, setOnTimeDeliveryPerformanceCard] = useState({ cardValue: null, benchmark: null })


  //--------------------DeliveryStatusbyDistribution_Forecast----------------
  const [DeliveryStatusbyDistributionData, setDeliveryStatusbyDistributionForecastData] = useState([])
  const [DeliveryStatus, setDeliveryStatus] = useState({ MATKL_Material_Category: [], DeliveryCount: [] })


  //-------------------Product Return Rate ------------------------
  const [productReturnRateData, setProductReturnRateData] = useState([])
  const [productReturnRateeCard, setproductReturnRateeCard] = useState({ cardValue: null, benchmark: null })
  // const [ProductReturnRateByYear, setProductReturnRateByYear] = useState({ ProductReturnRate: [], MTEXT_ClientName: [] })
  //-------------------Perfect Order Rate------------------------
  const [perfectOrderRateData, setPerfectOrderRateData] = useState([])
  const [perfectOrderRateCard, setPerfectOrderRateCard] = useState({ cardValue: null, benchmark: null })
  //-------------------Back Order Rate------------------------
  const [backOrderRateData, setBackOrderRateData] = useState([])
  const [backOrderRate, setBackOrderRate] = useState({ cardValue: null, benchmark: null })
  const [dccLoder, setdccLoder] = useState(0);
  const [distRibution, setDistributionColumn] = useState(0)

  const fetchClients = async () => {
    try {
      const response = await apiService.filterdropdown();
      const productsData = response.Product_Category || [];
      setproducts(productsData);
      setSelectedProduct("All");
      const clientData = response.customer_name || [];
      setClients(clientData);
      const supplierFromUrl = searchParams.get('customer') || '';
      if (supplierFromUrl) {
        setSelectedCustomer(supplierFromUrl);
      }
      else if (clientData.length > 0) {
        setSelectedCustomer(clientData[0].NAME1);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };
  const fetchBenchMark = async () => {
    const benchMarkResponse = await apiService.benchmarkShow();
    if (benchMarkResponse.status === "Success") {
      setBenchMarkData(benchMarkResponse.client)
    }
    // console.log('BenchMarkData', benchMarkData);
  }

  const fetchData = async () => {
    try {
      // setLoading(true);
      //------------OrderFillRateForecast---------------
      const OrderFillRateResponse = await apiService.OrderFillRateForecast();
      setOrderFillRateForecastData(OrderFillRateResponse.Order_Fill_Rate_Forecast)
      if (OrderFillRateResponse.status === 'success' && selectedCustomer !== '' && selectedDate && benchMarkData) {
        const filteredOFR = filterDateCustomer(OrderFillRateResponse.Order_Fill_Rate_Forecast, selectedDate, selectedCustomer)
        const persentageOFR = calculateAveragePercentage(filteredOFR, 'orderfillrate')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
        const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
        setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
        const ORResult = calculateGroupByAverage(filteredOFR, 'matkl_material_category', 'orderfillrate');
        setOrderFillRateChart({
          matkl_material_category: ORResult.matkl_material_category,
          orderfillrate: ORResult.orderfillrate
        })
      }


      //------------Product Return Rate---------------
      const productReturnRateResponse = await apiService.ProductReturnRate();
      setProductReturnRateData(productReturnRateResponse.ProductReturnRate)
      if (productReturnRateResponse.status === 'success' && selectedCustomer !== '' && selectedDate && benchMarkData) {
        const filteredPR = filterDateCustomer(productReturnRateResponse.ProductReturnRate, selectedDate, selectedCustomer)
        const persentagePR = calculateAveragePercentage(filteredPR, 'productreturnrate')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
        const benchMark = persentagePR >= filteredBenchMark ? 'high' : 'low'
        setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })

      }
      //------------Perfect Order Rate---------------
      const perfectOrderRateResponse = await apiService.PerfectOrderRateForecast();
      setPerfectOrderRateData(perfectOrderRateResponse.Perfect_Order_Rate_Forecast)
      if (perfectOrderRateResponse.status === 'success' && selectedCustomer !== '' && selectedDate && benchMarkData) {
        const filteredPO = filterByDateAndCustomerSAP(perfectOrderRateResponse.Perfect_Order_Rate_Forecast, selectedDate, selectedCustomer)
        const persentagePO = calculateAveragePercentage(filteredPO, 'perfect_order_rate')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
        const benchMark = persentagePO >= filteredBenchMark ? 'high' : 'low'
        setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMark })
      }

      

      //------------DeliveryPerformance---------------
      const OnTimeDeliveryPerformanceresponse = await apiService.OnTimeDeliveryPerformance();
      setOnTimeDeliveryPerformanceData(OnTimeDeliveryPerformanceresponse.OnTimeDeliveryPerformance_Forecast)
      if (OnTimeDeliveryPerformanceresponse.status === 'success' && selectedCustomer !== '' && selectedDate && benchMarkData) {
        const filteredDF = filterDateCustomer(OnTimeDeliveryPerformanceresponse.OnTimeDeliveryPerformance_Forecast, selectedDate, selectedCustomer)
        const persentageDF = calculateAveragePercentage(filteredDF, 'ontimedeliveryperformance')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
        const benchMarkDF = persentageDF >= filteredBenchMark ? 'high' : 'low'
        setOnTimeDeliveryPerformanceCard({ cardValue: persentageDF, benchmark: benchMarkDF })
      }


      //   ------------Back Order Rate---------------
      const backOrderRateResponse = await apiService.backOrderRate();
      setBackOrderRateData(backOrderRateResponse.Back_order_rate_Forecast)
      if (backOrderRateResponse.status === 'success' && selectedCustomer !== '' && selectedDate && benchMarkData) {
        const filteredBOR = filterDateCustomer(backOrderRateResponse.Back_order_rate_Forecast, selectedDate, selectedCustomer)
        // console.log('filteredBOR',filteredBOR);
        const persentageBOR = calculateAveragePercentage(filteredBOR, 'backorderrate')
        const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
        const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
        setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })
      }

      //------------DeliveryStatusbyDistribution---------------
      const DeliveryStatusbyDistributionresponse = await apiService.DeliveryStatus();
      console.log('DeliveryStatusbyDistributionresponse',DeliveryStatusbyDistributionresponse);
      setDeliveryStatusbyDistributionForecastData(DeliveryStatusbyDistributionresponse.DeliveryStatusbyDistribution_Forecast)
      if (DeliveryStatusbyDistributionresponse.status === 'success' && selectedCustomer !== '' && selectedDate) {
        const filteredDS = filterDateCustomer(DeliveryStatusbyDistributionresponse.DeliveryStatusbyDistribution_Forecast, selectedDate, selectedCustomer);

        const DeliveryStatusResult = calculateGroupBySum(filteredDS, 'matkl_material_category', 'deliverycount');
         console.log('DeliveryStatusResult',DeliveryStatusResult);
        setDeliveryStatus({
          MATKL_Material_Category: DeliveryStatusResult.matkl_material_category,
          DeliveryCount: DeliveryStatusResult.deliverycount
        })
       
        
      }
      
      flagSet();
    } catch (error) {
      console.error('Error fetching :', error.message);
    }
    finally {
      // setLoading(false);
    }

  };

  useEffect(() => {
    const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
    setSelectedDate(formattedDataDate);
    fetchBenchMark();
  }, []);

  useEffect(() => {
    setmonthYear('Selected month and year');
    fetchData();
    return () => {
    };
  }, [clients]);

  useEffect(() => {
    fetchClients();
  }, []);


  const flagSet =()=>{
    if(OrderFillRateChart.matkl_material_category.length > 0){
      setDistributionColumn(1)
    }
    else
    {
      setDistributionColumn(1)

    }
    if(DeliveryStatus.MATKL_Material_Category.length > 0){
      setdccLoder(1)
    }
    else
    {
      setdccLoder(1)

    }
  }


  const handleDateChange = async (newValue) => {
    try {
      const formattedDataDate = dayjs(newValue).format('MMM YYYY');
      setSelectedDate(formattedDataDate);


      if (selectedCustomer === 'All' && selectedProduct === 'All' && selectedDate) {


        // ------------Back Order Rate---------------
        const filteredBOR = filterByDate(backOrderRateData, formattedDataDate)
        const persentageBOR = calculateAveragePercentage(filteredBOR, 'backorderrate')
        const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
        const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
        setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })

        // ----------Order Fill Rate------------
        const filteredOFR = filterByDate(OrderFillRateForecastData, formattedDataDate)
        const persentageOFR = calculateAveragePercentage(filteredOFR, 'orderfillrate')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
        const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
        setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
        const ORResult = calculateGroupByAverage(filteredOFR, 'matkl_material_category', 'orderfillrate');
        setOrderFillRateChart({
          matkl_material_category: ORResult.matkl_material_category,
          orderfillrate: ORResult.orderfillrate
        })

        //------------DeliveryPerformance---------------
        const filteredOTDP = filterByDate(OnTimeDeliveryPerformanceData, formattedDataDate);
        const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'ontimedeliveryperformance')
        const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
        const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
        setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })

        //------------DeliveryStatusbyDistribution---------------
        const filteredDS = filterByDate(DeliveryStatusbyDistributionData, formattedDataDate);
        const DeliveryStatusResult = calculateGroupBySum(filteredDS, 'matkl_material_category', 'deliverycount');
        setDeliveryStatus({
          MATKL_Material_Category: DeliveryStatusResult.matkl_material_category,
          DeliveryCount: DeliveryStatusResult.deliverycount
        })
     
        //------------Perfect Return rate---------------
        const filteredPR = filterByDate(productReturnRateData, formattedDataDate)
        const persentagePR = calculateAveragePercentage(filteredPR, 'productreturnrate')
        const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
        const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
        setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })
        //------------Perfect Order rate---------------
        const filteredPO = filterByDateAndCustomerSAP(perfectOrderRateData, formattedDataDate)
        const persentagePO = calculateAveragePercentage(filteredPO, 'perfect_order_rate')
        const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
        const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
        setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })



      }
      else if (selectedProduct === 'All' && selectedCustomer !== 'All' && selectedDate) {

        // ------------Back Order Rate---------------
        const filteredBOR = filterDateCustomer(backOrderRateData, formattedDataDate, selectedCustomer)
        const persentageBOR = calculateAveragePercentage(filteredBOR, 'backorderrate')
        const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
        const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
        setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })

        // ----------Order Fill Rate------------
        const filteredOFR = filterDateCustomer(OrderFillRateForecastData, formattedDataDate, selectedCustomer)
        const persentageOFR = calculateAveragePercentage(filteredOFR, 'orderfillrate')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
        const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
        setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
        const ORResult = calculateGroupByAverage(filteredOFR, 'matkl_material_category', 'orderfillrate');
        setOrderFillRateChart({
          matkl_material_category: ORResult.matkl_material_category,
          orderfillrate: ORResult.orderfillrate
        })

        //------------DeliveryPerformance---------------
        const filteredOTDP = filterDateCustomer(OnTimeDeliveryPerformanceData, formattedDataDate, selectedCustomer);
        const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'ontimedeliveryperformance')
        const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
        const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
        setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })

        //------------DeliveryStatusbyDistribution---------------
        const filteredDS = filterDateCustomer(DeliveryStatusbyDistributionData, formattedDataDate, selectedCustomer);
        const DeliveryStatusResult = calculateGroupBySum(filteredDS, 'matkl_material_category', 'deliverycount');
        setDeliveryStatus({
          MATKL_Material_Category: DeliveryStatusResult.matkl_material_category,
          DeliveryCount: DeliveryStatusResult.deliverycount
        })
       
        //------------Perfect Return rate---------------
        const filteredPR = filterDateCustomer(productReturnRateData, formattedDataDate, selectedCustomer)
        const persentagePR = calculateAveragePercentage(filteredPR, 'productreturnrate')
        const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
        const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
        setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })
        //------------Perfect Order rate---------------
        const filteredPO = filterByDateAndCustomerSAP(perfectOrderRateData, formattedDataDate, selectedCustomer)
        const persentagePO = calculateAveragePercentage(filteredPO, 'perfect_order_rate')
        const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
        const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
        setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })


      }
      else if (selectedProduct !== 'All' && selectedCustomer === 'All' && selectedDate) {


        // ------------Back Order Rate---------------
        const filteredBOR = filterByDateProduct(backOrderRateData, formattedDataDate, selectedProduct)
        const persentageBOR = calculateAveragePercentage(filteredBOR, 'backorderrate')
        const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
        const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
        setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })

        // ----------Order Fill Rate------------
        const filteredOFR = filterByDateProduct(OrderFillRateForecastData, formattedDataDate, selectedProduct)
        const persentageOFR = calculateAveragePercentage(filteredOFR, 'orderfillrate')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
        const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
        setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
        const ORResult = calculateGroupByAverage(filteredOFR, 'matkl_material_category', 'orderfillrate');
        setOrderFillRateChart({
          matkl_material_category: ORResult.matkl_material_category,
          orderfillrate: ORResult.orderfillrate
        })

        //------------DeliveryPerformance---------------
        const filteredOTDP = filterByDateProduct(OnTimeDeliveryPerformanceData, formattedDataDate, selectedProduct);
        const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'ontimedeliveryperformance')
        const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
        const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
        setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })

        //------------DeliveryStatusbyDistribution---------------
        const filteredDS = filterByDateProduct(DeliveryStatusbyDistributionData, formattedDataDate, selectedProduct);
        const DeliveryStatusResult = calculateGroupBySum(filteredDS, 'matkl_material_category', 'deliverycount');
        setDeliveryStatus({
          MATKL_Material_Category: DeliveryStatusResult.matkl_material_category,
          DeliveryCount: DeliveryStatusResult.deliverycount
        })
      
        //------------Perfect Return rate---------------
        const filteredPR = filterByDateProduct(productReturnRateData, formattedDataDate, selectedProduct)
        const persentagePR = calculateAveragePercentage(filteredPR, 'productreturnrate')
        const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
        const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
        setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })
        //------------Perfect Order rate---------------
        const filteredPO = filterByDateProduct(perfectOrderRateData, formattedDataDate, selectedProduct)
        const persentagePO = calculateAveragePercentage(filteredPO, 'perfect_order_rate')
        const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
        const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
        setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })



      }
      else {
        // ------------Back Order Rate---------------
        const filteredBOR = filterDateCustomerProduct(backOrderRateData, formattedDataDate, selectedCustomer, selectedProduct)
        const persentageBOR = calculateAveragePercentage(filteredBOR, 'backorderrate')
        const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
        const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
        setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })

        // ----------Order Fill Rate------------
        const filteredOFR = filterDateCustomerProduct(OrderFillRateForecastData, formattedDataDate, selectedCustomer, selectedProduct)
        const persentageOFR = calculateAveragePercentage(filteredOFR, 'orderfillrate')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
        const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
        setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
        const ORResult = calculateGroupByAverage(filteredOFR, 'matkl_material_category', 'orderfillrate');
        setOrderFillRateChart({
          matkl_material_category: ORResult.matkl_material_category,
          orderfillrate: ORResult.orderfillrate
        })

        //------------DeliveryPerformance---------------
        const filteredOTDP = filterDateCustomerProduct(OnTimeDeliveryPerformanceData, formattedDataDate, selectedCustomer, selectedProduct);
        const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'ontimedeliveryperformance')
        const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
        const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
        setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })

        //------------DeliveryStatusbyDistribution---------------
        const filteredDS = filterDateCustomerProduct(DeliveryStatusbyDistributionData, formattedDataDate, selectedCustomer, selectedProduct);
        const DeliveryStatusResult = calculateGroupBySum(filteredDS, 'matkl_material_category', 'deliverycount');
        setDeliveryStatus({
          MATKL_Material_Category: DeliveryStatusResult.matkl_material_category,
          DeliveryCount: DeliveryStatusResult.deliverycount
        })
      
        //------------Perfect Return rate---------------
        const filteredPR = filterDateCustomerProduct(productReturnRateData, formattedDataDate, selectedCustomer, selectedProduct)
        const persentagePR = calculateAveragePercentage(filteredPR, 'productreturnrate')
        const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
        const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
        setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })
        //------------Perfect Order rate---------------
        const filteredPO = filterDateCustomerProductSAP(perfectOrderRateData, formattedDataDate, selectedCustomer, selectedProduct)
        const persentagePO = calculateAveragePercentage(filteredPO, 'perfect_order_rate')
        const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
        const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
        setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })


      }


      flagSet()


    } catch (error) {
      console.error('Error fetching data for the selected date:', error.message);
    }
  };

  const handleClientChange = (event) => {
    const selectedValue = event
    setSelectedCustomer(event);


    if (selectedValue === "All" && selectedProduct === 'All' && selectedDate) {
      // setSelectedProduct('')
      console.log('handleClientChange a')
      //   ------------Back Order Rate---------------
      const filteredBOR = filterByDate(backOrderRateData, selectedDate)
      const persentageBOR = calculateAveragePercentage(filteredBOR, 'BackOrderRate')
      const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
      setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })

      //----------Order Fill Rate------------
      const filteredOFR = filterByDate(OrderFillRateForecastData, selectedDate)
      const persentageOFR = calculateAveragePercentage(filteredOFR, 'OrderFillRate')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
      const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
      setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
      const ORResult = calculateGroupByAverage(filteredOFR, 'MATKL_Material_Category', 'OrderFillRate');
      setOrderFillRateChart({
        matkl_material_category: ORResult.MATKL_Material_Category,
        orderfillrate: ORResult.OrderFillRate
      })
      //------------DeliveryPerformance---------------
      const filteredOTDP = filterByDate(OnTimeDeliveryPerformanceData, selectedDate);
      const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'OnTimeDeliveryPerformance')
      const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
      const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
      setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })

      //------------DeliveryStatusbyDistribution---------------
      const filteredDSD = filterByDate(DeliveryStatusbyDistributionData, selectedDate)
      const DeliveryStatusResult = calculateGroupBySum(filteredDSD, 'MATKL_Material_Category', 'DeliveryCount');
      setDeliveryStatus({
        MATKL_Material_Category: DeliveryStatusResult.MATKL_Material_Category,
        DeliveryCount: DeliveryStatusResult.DeliveryCount
      })
    
      //------------Perfect Return rate---------------
      const filteredPR = filterByDate(productReturnRateData, selectedDate)
      const persentagePR = calculateAveragePercentage(filteredPR, 'ProductReturnRate')
      const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })
      //------------Perfect Order rate---------------
      const filteredPO = filterByDate(perfectOrderRateData, selectedDate)
      const persentagePO = calculateAveragePercentage(filteredPO, 'Perfect_Order_Rate')
      const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })


    }
    else if (selectedProduct === 'All' && selectedValue !== 'All' && selectedDate) {
      //   ------------Back Order Rate---------------
      const filteredBOR = filterDateCustomer(backOrderRateData, selectedDate, selectedValue)
      const persentageBOR = calculateAveragePercentage(filteredBOR, 'backorderrate')
      const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
      setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })
      //----------Order Fill Rate------------
      const filteredOFR = filterDateCustomer(OrderFillRateForecastData, selectedDate, selectedValue)
      const persentageOFR = calculateAveragePercentage(filteredOFR, 'orderfillrate')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
      const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
      setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
      const ORResult = calculateGroupByAverage(filteredOFR, 'matkl_material_category', 'orderfillrate');
      setOrderFillRateChart({
        matkl_material_category: ORResult.matkl_material_category,
        orderfillrate: ORResult.orderfillrate
      })
      //------------DeliveryPerformance---------------
      const filteredOTDP = filterDateCustomer(OnTimeDeliveryPerformanceData, selectedDate, selectedValue);
      const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'ontimedeliveryperformance')
      const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
      const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
      setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })

      //------------DeliveryStatusbyDistribution---------------
      const filteredDS = filterDateCustomer(DeliveryStatusbyDistributionData, selectedDate, selectedValue);
      const DeliveryStatusResult = calculateGroupBySum(filteredDS, 'matkl_material_category', 'deliverycount');
      setDeliveryStatus({
        MATKL_Material_Category: DeliveryStatusResult.matkl_material_category,
        DeliveryCount: DeliveryStatusResult.deliverycount
      })
    
      //------------Perfect Return rate---------------
      const filteredPR = filterDateCustomer(productReturnRateData, selectedDate, selectedValue)
      const persentagePR = calculateAveragePercentage(filteredPR, 'productreturnrate')
      const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })
      //------------Perfect Order rate---------------
      const filteredPO = filterByDateAndCustomerSAP(perfectOrderRateData, selectedDate, selectedValue)
      const persentagePO = calculateAveragePercentage(filteredPO, 'perfect_order_rate')
      const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })


    }
    else if (selectedProduct !== 'All' && selectedValue === 'All' && selectedDate) {
      console.log('handel client change else if ');

      //   ------------Back Order Rate---------------
      const filteredBOR = filterByDateProduct(backOrderRateData, selectedDate, selectedProduct)
      // console.log('filteredBOR',filteredBOR)
      const persentageBOR = calculateAveragePercentage(filteredBOR, 'BackOrderRate')
      // console.log('persentageBOR client change if else',persentageBOR);
      const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
      setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })

      


      //----------Order Fill Rate------------
      const filteredOFR = filterByDateProduct(OrderFillRateForecastData, selectedDate, selectedProduct)
      const persentageOFR = calculateAveragePercentage(filteredOFR, 'OrderFillRate')
      
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
      // console.log('persentageBOR client change if else',filteredBenchMark);
      const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
      setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
      const ORResult = calculateGroupByAverage(filteredOFR, 'MATKL_Material_Category', 'OrderFillRate');
      // console.log('ORResult',ORResult);
      setOrderFillRateChart({
        matkl_material_category: ORResult.MATKL_Material_Category,
        orderfillrate: ORResult.OrderFillRate
      })

      //------------DeliveryPerformance---------------
      const filteredOTDP = filterByDateProduct(OnTimeDeliveryPerformanceData, selectedDate, selectedProduct);
      const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'OnTimeDeliveryPerformance')
      const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
      const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
      setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })

      //------------DeliveryStatusbyDistribution---------------
      const filteredDS = filterByDateProduct(DeliveryStatusbyDistributionData, selectedDate, selectedProduct);
      // console.log('persentageOTDP',filteredDS);
      const DeliveryStatusResult = calculateGroupBySum(filteredDS, 'MATKL_Material_Category', 'DeliveryCount');
      setDeliveryStatus({
        MATKL_Material_Category: DeliveryStatusResult.MATKL_Material_Category,
        DeliveryCount: DeliveryStatusResult.DeliveryCount
      })
    
      //------------Perfect Return rate---------------
      const filteredPR = filterByDateProduct(productReturnRateData, selectedDate, selectedProduct)
      const persentagePR = calculateAveragePercentage(filteredPR, 'ProductReturnRate')
      // console.log('persentagePR',persentagePR);
      const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })
      //------------Perfect Order rate---------------
      const filteredPO = filterByDateProduct(perfectOrderRateData, selectedDate, selectedProduct)
      const persentagePO = calculateAveragePercentage(filteredPO, 'Perfect_Order_Rate')
      const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })
    }

    else {
      //   ------------Back Order Rate---------------
      const filteredBOR = filterDateCustomerProduct(backOrderRateData, selectedDate, selectedValue, selectedProduct)
      const persentageBOR = calculateAveragePercentage(filteredBOR, 'backorderrate')
      const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
      setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })

      //----------Order Fill Rate------------
      const filteredOFR = filterDateCustomerProduct(OrderFillRateForecastData, selectedDate, selectedValue, selectedProduct)
      const persentageOFR = calculateAveragePercentage(filteredOFR, 'orderfillrate')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
      const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
      setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
      const ORResult = calculateGroupByAverage(filteredOFR, 'matkl_material_category', 'orderfillrate');
      setOrderFillRateChart({
        matkl_material_category: ORResult.matkl_material_category,
        orderfillrate: ORResult.orderfillrate
      })
      //------------DeliveryPerformance---------------
      const filteredOTDP = filterDateCustomerProduct(OnTimeDeliveryPerformanceData, selectedDate, selectedValue, selectedProduct);
      const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'ontimedeliveryperformance')
      const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
      const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
      setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })

      //------------DeliveryStatusbyDistribution---------------
      const filteredDS = filterDateCustomerProduct(DeliveryStatusbyDistributionData, selectedDate, selectedValue, selectedProduct);
      const DeliveryStatusResult = calculateGroupBySum(filteredDS, 'matkl_material_category', 'deliverycount');
      setDeliveryStatus({
        MATKL_Material_Category: DeliveryStatusResult.matkl_material_category,
        DeliveryCount: DeliveryStatusResult.deliverycount
      })
    
      //------------Perfect Return rate---------------
      const filteredPR = filterDateCustomerProduct(productReturnRateData, selectedDate, selectedValue, selectedProduct)
      const persentagePR = calculateAveragePercentage(filteredPR, 'productreturnrate')
      const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })
      //------------Perfect Order rate---------------
      const filteredPO = filterDateCustomerProductSAP(perfectOrderRateData, selectedDate, selectedValue, selectedProduct)
      const persentagePO = calculateAveragePercentage(filteredPO, 'perfect_order_rate')
      const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })

    }

    flagSet()

  };

  const productChange = async (selectedValue) => {
    setSelectedProduct(selectedValue)
    const selectedProductCate = selectedValue

    if (selectedCustomer === "All" && selectedProductCate === 'All' && selectedDate) {
      console.log('productChange both all');
      // setSelectedProduct('')
      //   ------------Back Order Rate---------------
      const filteredBOR = filterByDate(backOrderRateData, selectedDate)
      const persentageBOR = calculateAveragePercentage(filteredBOR, 'BackOrderRate')
      const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
      setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })

      //----------Order Fill Rate------------
      const filteredOFR = filterByDate(OrderFillRateForecastData, selectedDate)
      const persentageOFR = calculateAveragePercentage(filteredOFR, 'OrderFillRate')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
      const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
      setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
      const ORResult = calculateGroupByAverage(filteredOFR, 'MATKL_Material_Category', 'OrderFillRate');
      setOrderFillRateChart({
        matkl_material_category: ORResult.MATKL_Material_Category,
        orderfillrate: ORResult.OrderFillRate
      })

     
      //------------DeliveryPerformance---------------
      const filteredOTDP = filterByDate(OnTimeDeliveryPerformanceData, selectedDate);
      const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'OnTimeDeliveryPerformance')
      const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
      const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
      setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })

      //------------DeliveryStatusbyDistribution---------------
      const filteredDSD = filterByDate(DeliveryStatusbyDistributionData, selectedDate)
      const DeliveryStatusResult = calculateGroupBySum(filteredDSD, 'MATKL_Material_Category', 'DeliveryCount');
      setDeliveryStatus({
        MATKL_Material_Category: DeliveryStatusResult.MATKL_Material_Category,
        DeliveryCount: DeliveryStatusResult.DeliveryCount
      })
    
      //------------Perfect Return rate---------------
      const filteredPR = filterByDate(productReturnRateData, selectedDate)
      const persentagePR = calculateAveragePercentage(filteredPR, 'ProductReturnRate')
      const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })

      //------------Perfect Order rate---------------
      const filteredPO = filterByDate(perfectOrderRateData, selectedDate)
      const persentagePO = calculateAveragePercentage(filteredPO, 'Perfect_Order_Rate')
      const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })
    }


    else if (selectedProductCate === 'All' && selectedCustomer !== 'All' && selectedDate) {
      console.log('productChange else if 2');
      //   ------------Back Order Rate---------------
      const filteredBOR = filterDateCustomer(backOrderRateData, selectedDate, selectedCustomer)
      console.log('filteredBOR',filteredBOR);
      const persentageBOR = calculateAveragePercentage(filteredBOR, 'backorderrate')
      console.log('persentageBOR',persentageBOR);
      
      const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'backorderrate')
      const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
      setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })

      //----------Order Fill Rate------------
      const filteredOFR = filterDateCustomer(OrderFillRateForecastData, selectedDate, selectedCustomer)
      const persentageOFR = calculateAveragePercentage(filteredOFR, 'orderfillrate')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
      const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
      setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
      const ORResult = calculateGroupByAverage(filteredOFR, 'matkl_material_category', 'orderfillrate');
      setOrderFillRateChart({
        matkl_material_category: ORResult.matkl_material_category,
        orderfillrate: ORResult.orderfillrate
      })
      //------------DeliveryPerformance---------------
      const filteredOTDP = filterDateCustomer(OnTimeDeliveryPerformanceData, selectedDate, selectedCustomer);
      const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'ontimedeliveryperformance')
      const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
      const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
      setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })


      //------------DeliveryStatusbyDistribution---------------
      const filteredDS = filterDateCustomer(DeliveryStatusbyDistributionData, selectedDate, selectedCustomer);
      const DeliveryStatusResult = calculateGroupBySum(filteredDS, 'matkl_material_category', 'deliverycount');
      setDeliveryStatus({
        MATKL_Material_Category: DeliveryStatusResult.matkl_material_category,
        DeliveryCount: DeliveryStatusResult.deliverycount
      })
    
      //------------Perfect Return rate---------------
      const filteredPR = filterDateCustomer(productReturnRateData, selectedDate, selectedCustomer)
      const persentagePR = calculateAveragePercentage(filteredPR, 'productreturnrate')
      const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })

      //------------Perfect Order rate---------------
      const filteredPO = filterByDateAndCustomerSAP(perfectOrderRateData, selectedDate, selectedCustomer)
      const persentagePO = calculateAveragePercentage(filteredPO, 'perfect_order_rate')
      const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })


    }
    else if (selectedCustomer === 'All' && selectedProductCate !== 'All' && selectedDate) {
      console.log('productChange else if');
      //   ------------Back Order Rate---------------
      const filteredBOR = filterByDateProduct(backOrderRateData, selectedDate, selectedProductCate)
      const persentageBOR = calculateAveragePercentage(filteredBOR, 'BackOrderRate')
      const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
      setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })
      //----------Order Fill Rate------------
      const filteredOFR = filterByDateProduct(OrderFillRateForecastData, selectedDate, selectedProductCate)
      const persentageOFR = calculateAveragePercentage(filteredOFR, 'OrderFillRate')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
      const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
      setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
      const ORResult = calculateGroupByAverage(filteredOFR, 'MATKL_Material_Category', 'OrderFillRate');
      setOrderFillRateChart({
        matkl_material_category: ORResult.MATKL_Material_Category,
        orderfillrate: ORResult.OrderFillRate
      })

      //------------DeliveryPerformance---------------
      const filteredOTDP = filterByDateProduct(OnTimeDeliveryPerformanceData, selectedDate, selectedProductCate);
      const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'OnTimeDeliveryPerformance')
      const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
      const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
      setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })


      //------------DeliveryStatusbyDistribution---------------
      const filteredDS = filterByDateProduct(DeliveryStatusbyDistributionData, selectedDate, selectedProductCate);
      const DeliveryStatusResult = calculateGroupBySum(filteredDS, 'MATKL_Material_Category', 'DeliveryCount');
      setDeliveryStatus({
        MATKL_Material_Category: DeliveryStatusResult.MATKL_Material_Category,
        DeliveryCount: DeliveryStatusResult.DeliveryCount
      })
   
      //------------Perfect Return rate---------------
      const filteredPR = filterByDateProduct(productReturnRateData, selectedDate, selectedProductCate)
      const persentagePR = calculateAveragePercentage(filteredPR, 'ProductReturnRate')
      const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })

      //------------Perfect Order rate---------------
      const filteredPO = filterByDateProduct(perfectOrderRateData, selectedDate, selectedProductCate)
      const persentagePO = calculateAveragePercentage(filteredPO, 'Perfect_Order_Rate')
      const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })


    }
    else {
      console.log('product change else')
      //   ------------Back Order Rate---------------
      const filteredBOR = filterDateCustomerProduct(backOrderRateData, selectedDate, selectedCustomer, selectedProductCate)
      const persentageBOR = calculateAveragePercentage(filteredBOR, 'backorderrate')
      const filteredBenchMarkBO = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      const benchMarkBO = persentageBOR >= filteredBenchMarkBO ? 'high' : 'low'
      setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMarkBO })
      //----------Order Fill Rate------------
      const filteredOFR = filterDateCustomerProduct(OrderFillRateForecastData, selectedDate, selectedCustomer, selectedProductCate)
      const persentageOFR = calculateAveragePercentage(filteredOFR, 'orderfillrate')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fill_Rate_Forecast')
      const benchMarkOFR = persentageOFR >= filteredBenchMark ? 'high' : 'low'
      setOrderFillRateForecastCard({ cardValue: persentageOFR, benchmark: benchMarkOFR })
      const ORResult = calculateGroupByAverage(filteredOFR, 'matkl_material_category', 'orderfillrate');
      setOrderFillRateChart({
        matkl_material_category: ORResult.matkl_material_category,
        orderfillrate: ORResult.orderfillrate
      })
      //------------DeliveryPerformance---------------
      const filteredOTDP = filterDateCustomerProduct(OnTimeDeliveryPerformanceData, selectedDate, selectedCustomer, selectedProductCate);
      const persentageOTDP = calculateAveragePercentage(filteredOTDP, 'ontimedeliveryperformance')
      const filteredBenchMarkOTDP = filterBenchMarkData(benchMarkData, 'OnTimeDeliveryPerformance_Forecast')
      const benchMarkOTDP = persentageOTDP >= filteredBenchMarkOTDP ? 'high' : 'low'
      setOnTimeDeliveryPerformanceCard({ cardValue: persentageOTDP, benchmark: benchMarkOTDP })


      //------------DeliveryStatusbyDistribution---------------
      const filteredDS = filterDateCustomerProduct(DeliveryStatusbyDistributionData, selectedDate, selectedCustomer, selectedProductCate);
      const DeliveryStatusResult = calculateGroupBySum(filteredDS, 'matkl_material_category', 'deliverycount');
      setDeliveryStatus({
        MATKL_Material_Category: DeliveryStatusResult.matkl_material_category,
        DeliveryCount: DeliveryStatusResult.deliverycount
      })
    
      //------------Perfect Return rate---------------
      const filteredPR = filterDateCustomerProduct(productReturnRateData, selectedDate, selectedCustomer, selectedProductCate)
      const persentagePR = calculateAveragePercentage(filteredPR, 'productreturnrate')
      const filteredBenchMarkPR = filterBenchMarkData(benchMarkData, 'ProductReturnRate')
      const benchMark = persentagePR >= filteredBenchMarkPR ? 'high' : 'low'
      setproductReturnRateeCard({ cardValue: persentagePR, benchmark: benchMark })

      //------------Perfect Order rate---------------
      const filteredPO = filterDateCustomerProductSAP(perfectOrderRateData, selectedDate, selectedCustomer, selectedProductCate)
      const persentagePO = calculateAveragePercentage(filteredPO, 'perfect_order_rate')
      const filteredBenchPO = filterBenchMarkData(benchMarkData, 'Perfect_Order_Rate')
      const benchMarkPO = persentagePO >= filteredBenchPO ? 'high' : 'low'
      setPerfectOrderRateCard({ cardValue: persentagePO, benchmark: benchMarkPO })

    }

    flagSet()
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
          >Despatch</Typography>
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
              value={selectedCustomer}
              label="Customer Name"
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
          <FormControl fullWidth>
            <InputLabel id="client-select-label">Products Category</InputLabel>
            <Select
              labelId="client-select-label"
              id="client-select"
              value={selectedProduct}
              label="Products Category"
              sx={{ minWidth: '250px' }}
              MenuProps={{
                PaperProps: { style: { maxHeight: '250px' } }
              }}
              onChange={(event) => {
                productChange(event.target.value);
              }}
            >
              {showAllOption && (
                <MenuItem key="all-option" value="All">
                  All
                </MenuItem>
              )}
              {products.map((client, i) => (
                <MenuItem key={i} value={client.MATKL_Material_Category}>
                  {client.MATKL_Material_Category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={4} md={4}>
          <GlobalCard
            title="Order Fill Rate"
            subtitle={loading ? 'Loading...' : OrderFillRateForecastCard.cardValue?.toString() ?? 'Loading...'}
            tooltipContent="The percentage of customer orders that have been successfully fulfilled out of the total orders placed"
            units={loading ? null : '%'}
            benchmark={loading ? null : OrderFillRateForecastCard.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
        <Grid item xs={4} md={4}>
          <GlobalCard
            title="Product Return Rate"
            subtitle={loading ? 'Loading...' : productReturnRateeCard.cardValue?.toString() ?? 'Loading...'}
            tooltipContent="A Rate of Return KPI measures the rate at which shipped items are returned"
            units={loading ? null : '%'}
            benchmark={loading ? null : productReturnRateeCard.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
        <Grid item xs={4} md={4}>
          <GlobalCard
            title="Perfect Order Rate"
            subtitle={loading ? 'Loading...' : perfectOrderRateCard.cardValue?.toString() ?? 'Loading...'}
            tooltipContent='The perfect order rate is a key performance indicator (KPI) that measures the percentage of orders that are fulfilled without errors'
            units={loading ? null : '%'}
            benchmark={loading ? null : perfectOrderRateCard.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>

        <Grid item xs={4} md={4}>
          <GlobalCard
            title="On Time Delivery Performance"
            subtitle={loading ? 'Loading...' : OnTimeDeliveryPerformanceCard.cardValue?.toString() ?? 'Loading...'}
            tooltipContent=" Delivery Performance is crucial for customer satisfaction and can impact a company's reputation and competitiveness in the market"
            units={loading ? null : '%'}
            benchmark={loading ? null : OnTimeDeliveryPerformanceCard.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
        
        <Grid item xs={4} md={4}>
          <GlobalCard
            title="Back Order Rate"
            subtitle={loading ? 'Loading...' : backOrderRate.cardValue?.toString() ?? 'Loading...'}
            tooltipContent="The Back Order Rate KPI measures how many orders cannot be filled at the time a customer places them"
            units={loading ? null : '%'}
            benchmark={loading ? null : backOrderRate.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>

      </Grid>
      {/* <Grid container spacing={2} mt={1}> */}
        
        {/* <Grid item xs={3} md={3}>
           <GlobalCard
              title="Order Value"
              subtitle={loading ? 'Loading...' : 'pending' ?? '0'}
              // tooltipContent="info"
              benchmark='low'
            />
        </Grid> */}
      {/* </Grid> */}
      <Grid container spacing={2} mt={1}>
        <Grid item xs={6} md={6}>
          <DonutCharts
            labels={OrderFillRateChart.matkl_material_category}
            series={OrderFillRateChart.orderfillrate}
            flag={distRibution}
            tilesLables="Order Fill rate by Product Category"
            height={365}
          />
       
        </Grid>
        <Grid item xs={6} md={6}>
          <DistributedColumnChart
            labels={DeliveryStatus.MATKL_Material_Category}
            series={DeliveryStatus.DeliveryCount}
            tilesLables="Distribution by Product Category"
            flag={dccLoder}
            height={350}
            legend='Total Distribution'
            format_func={formatQuantity}
          />
        </Grid>
      </Grid>
    </Box>
  );
};


export default DispatchSupplychain;
