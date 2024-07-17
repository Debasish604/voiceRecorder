import { Box, useTheme, Grid, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import PieCharts from "../../../components/charts/PieCharts";
import DistributedColumnChart from "../../../components/charts/DistributedColumnChart";
import React, { useEffect, useState } from 'react';
import { apiService } from "../../../service/api-service";
import SimpleBackdrop from "../../../scenes/global/Loader";
import WorldMap from "./WorldMap";
import GlobalCard from "../../../components/GlobalCard";
import NotificationIcon from "../../../components/common/NotificationsIcon";
import BarCharts from "../../../components/charts/Barchart";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//----------------------For filter -------------------------------
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  formatDays,
  calculateGroupByAverage,
  calculateAveragePercentage,
  filterByDateAndClient,
  filterByDateClientProduct,
  calculateGroupByPercentage,
  formatPersentage,
  calculateAverage,
  filterBenchMarkData,
  filterByDate,
  filterByDateProduct
} from "../../../utils/GlobalFilters";
import ColumnChart from "../../../components/charts/ColumnChart";
import { useLocation } from 'react-router-dom';
import Chatbot from "../../../components/chat-bot";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@mui/material/Tooltip';
import { faBell, faVolumeUp, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';

const Purchase = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // const initialSupplier = searchParams.get('supplier') || ''; // Get the supplier parameter from the URL
  // const [selectedClient, setSelectedClient] = useState(initialSupplier);
  // console.log('come from dashboard',initialSupplier);


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('')
  const [products, setproducts] = useState([]);
  // const [onDialogOpen, setOnDialogOpen] = useState(false);
  const [onDialogOpenRatio, setOnDialogOpenRatio] = useState(false);
  const [onShowAnamoly, setOnAnamoly] = useState(false);



  //--------------------SupplierRiskScore----------------
  const [supplierRiskScoreApiData, setsupplierRiskScoreApiData] = useState([])
  const [supplierRiskScore, setSupplierRiskScore] = useState({ cardValue: null, benchmark: null })
  const [riskScoreProduct, setRiskScoreProduct] = useState({
    product_category: [],
    risk_score: []
  })
  //--------------------DivRation----------------
  const [supplierDivRationData, setDivRationData] = useState([])
  const [supplierDivRation, setDivRation] = useState({ cardValue: null, benchmark: null })
  const [supplierDivRatioBarChart, setDivRationBarchart] = useState({
    diver_ratio: [],
    client: []
  })
  //--------------------Lead Time Vari----------------
  const [supplierLeadTimeVariData, setLeadTimeVariData] = useState([])
  const [supplierLeadTimeVari, setLeadTimeVari] = useState({ cardValue: null, benchmark: null })
  const [supplierLeadTimeProduct, setLeadTimeProduct] = useState({
    product: [],
    lead_time: []
  })
  //--------------------Quality Index----------------
  const [supplierQualityIndexData, setQualityIndexData] = useState([])
  const [supplierQualityIndex, setQualityIndex] = useState({ cardValue: null, benchmark: null })
  const [supplierQIBarChart, setQIBarchart] = useState({
    sqi_index: [],
    client: []
  })
  //--------------------Suppler Performance Score----------------
  const [supplierPerfScoreData, setPerfScoreData] = useState([])
  const [supplierPerfScoreChart, setPerfScorechart] = useState({
    product: [],
    perf_score: []
  })

  //-------------------- Bench mark----------------
  const [benchMarkData, setBenchMarkData] = useState([])
  //-------------------- Score----------------
  const [supplierRiskScoreLandCountry, setSupplierRiskScoreLandCountry] = useState(null);
  // const [SupplierLeadTimeVariabilityByProductCategoryAnomalyChart, setSupplierLeadTimeVariabilityByProductCategoryAnomalyChart] = useState(null);
  // const [SupplierLeadTimeVariabilityByProductCategoryAnomalyNonanomalyChart, setSupplierLeadTimeVariabilityByProductCategoryAnomalyNonanomalyChart] = useState(null);


  //----------------------For Date filter -------------------------------
  const [selectedDate, setSelectedDate] = useState('');
  const [monthYear, setmonthYear] = useState('Select month and year')
  const currentDate = new Date();


  const [showAllOption, setShowAllOption] = useState(true); // For ALL

  const [riskScoreProductLoder, setRiskScoreProductLoder] = useState(0);
  const [supplierLeadTimeProductLoder, setSupplierLeadTimeProductLoder] = useState(0);
  const [supplierQIBarChartLoder, setSupplierQIBarChartLoder] = useState(0);
  const [supplierDivRatioBarChartLoder, setSupplierDivRatioBarChartLoder] = useState(0);
  const [dccLoder, setDccLoder] = useState(0);


  const flagSet = () => {
    setRiskScoreProductLoder(riskScoreProduct.product_category.length > 0 ? 1 : 1);
    setSupplierLeadTimeProductLoder(supplierLeadTimeProduct.product.length > 0 ? 1 : 1);
    setDccLoder(supplierPerfScoreChart.perf_score.length > 0 ? 1 : 1);
    setSupplierQIBarChartLoder(supplierQIBarChart.client.length > 0 ? 1 : 1);
    setSupplierDivRatioBarChartLoder(supplierDivRatioBarChart.client.length > 0 ? 1 : 1);
  };



  // const formatDate = (dateString) => {
  //   const originalDate = new Date(dateString);
  //   const formattedDate = originalDate.toLocaleString('default', { month: 'short', year: 'numeric' });
  //   return formattedDate;
  // };



  // const onClickBellIcon = async (event) => {
  //   setOnDialogOpen(true);
  // };

  // const onCloseDialog = async (event) => {
  //   setOnDialogOpen(false);
  //   // setNotificationDialogOpen((prevOpen) => !prevOpen);
  // };
  const onClickBellIconRatio = async (event) => {
    setOnDialogOpenRatio(true);
  };

  const onCloseDialogRatio = async (event) => {
    setOnDialogOpenRatio(false);
    // setNotificationDialogOpen((prevOpen) => !prevOpen);
  };

  const fetchBenchMark = async () => {
    //--------------------Bench Mark -----------------------
    const benchMarkResponse = await apiService.benchmarkShow();
    //console.log('data', benchMarkResponse);
    if (benchMarkResponse.status === "Success") {
      setBenchMarkData(benchMarkResponse.client)
    }
  };

  const fetchClients = async () => {
    try {
      const response = await apiService.filterdropdown();
      const productsData = response.Product_Category_raw || [];
      setproducts(productsData);

      // Set default selected product to "All"
      setSelectedProduct("All");

      const clientData = response.client || [];
      setClients(clientData);

      const supplierFromUrl = searchParams.get('supplier') || '';
      if (supplierFromUrl) {
        setSelectedClient(supplierFromUrl);
      }
      else if (clientData.length > 0) {
        setSelectedClient(clientData[0].MTEXT_ClientName);
      }

    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };
  ///////////////////////////////////////////////////Loader/////////////////////////////////////////////////////////////////
  // const flagSet =()=>{

  //   if(riskScoreProduct.product_category.length > 0){
  //     setriskScoreProductLoder(1)
  //   }
  //   else{
  //     setriskScoreProductLoder(1)
  //   }

  //   if(supplierLeadTimeProduct.product.length > 0){
  //     setsupplierLeadTimeProductLoder(1)
  //   }
  //   else{
  //     setsupplierLeadTimeProductLoder(1)
  //   }
  //   if(supplierPerfScoreChart.perf_score.length > 0){
  //     console.log('setdccLoder',dccLoder);
  //     setdccLoder(1)
  //   }
  //   else{
  //     setdccLoder(1)
  //   }
  //   if(supplierQIBarChart.client.length > 0){
  //     setsupplierQIBarChartLoder(1)
  //   }
  //   else{
  //     setsupplierQIBarChartLoder(1)
  //   }
  //   if(supplierDivRatioBarChart.client.length > 0){
  //     supplierDivRatioBarChartLoder(1)
  //   }
  //   else{
  //     supplierDivRatioBarChartLoder(1)
  //   }

  // }





  const fetchPurchaseData = async () => {
    try {
      console.log('fetchPurchaseData--------------------------------------------------');
      // setLoading(true);
      //------------------SupplierRiskScore----------------
      const supplyierResponse = await apiService.SupplierRiskScore();
      setsupplierRiskScoreApiData(supplyierResponse.SupplierRiskScore_Forecast)
      if (supplyierResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData && selectedProduct) {
        const filteredSRS = filterByDateAndClient(supplyierResponse.SupplierRiskScore_Forecast, selectedDate, selectedClient)
        // console.log('filteredSRS',filteredSRS)
        const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
        // console.log('persentageSRS',persentageSRS)
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
        // console.log('filteredBenchMark',filteredBenchMark);
        const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
        setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

        const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
        setRiskScoreProduct({
          product_category: riskScoreResultFun.MATKL_Material_Category,
          risk_score: riskScoreResultFun.SupplierRiskScore
        })

      }
      //--------------------Quality Score----------------

      const supplyQualityIndexResponse = await apiService.SupplierQualityIndex();

      setQualityIndexData(supplyQualityIndexResponse.SupplierQualityIndex_Forecast)
      if (supplyQualityIndexResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData && selectedProduct) {
        const filteredQS = filterByDateAndClient(supplyQualityIndexResponse.SupplierQualityIndex_Forecast, selectedDate, selectedClient)
        const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
        const benchMark = persentageQS >= filteredBenchMark ? 'high' : 'low'
        setQualityIndex({ cardValue: persentageQS, benchmark: benchMark })

        const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
        setQIBarchart({
          sqi_index: qualityIndexResult.SupplierQualityIndex,
          client: qualityIndexResult.MTEXT_ClientName
        })


      }

      //--------------------Lead Time Vari----------------
      const supplyierLeadTimeResponse = await apiService.Supplier_Lead_Time_Variability();
      setLeadTimeVariData(supplyierLeadTimeResponse.Supplier_Lead_Time_Variability_Forecast)
      if (supplyierLeadTimeResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData && selectedProduct) {
        const filteredLTV = filterByDateAndClient(supplyierLeadTimeResponse.Supplier_Lead_Time_Variability_Forecast, selectedDate, selectedClient)
        const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')
        const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
        const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
        setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })

        const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
        setLeadTimeProduct({
          product: leadTimeResult.MATKL_Material_Category,
          lead_time: leadTimeResult.Supplier_Lead_Time_Variability
        })

      }

      //--------------------Suppler Performance Score----------------
      const suppPerfScoreResponse = await apiService.SupplierPerformanceScore();
      console.log('suppPerfScoreResponse-----------------------', suppPerfScoreResponse);
      if (suppPerfScoreResponse.status === 'success' && selectedClient !== '' && selectedDate && selectedProduct) {
        setPerfScoreData(suppPerfScoreResponse.Supplier_Performance_Score_Forecast)
        const filteredPS = filterByDateAndClient(suppPerfScoreResponse.Supplier_Performance_Score_Forecast, selectedDate, selectedClient)
        const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
        console.log('sumPerfScore-----------------------', sumPerfScore);

        setPerfScorechart({
          product: sumPerfScore.MATKL_Material_Category,
          perf_score: sumPerfScore.SupplierPerformanceScore
        })
      }

      //--------------------DivRation----------------

      const supplyierDivRatioResponse = await apiService.Supplier_Diversification_Ratio_Forecast();
      setDivRationData(supplyierDivRatioResponse.Supplier_Diversification_Ratio_Forecast)
      if (supplyierDivRatioResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData && selectedProduct) {
        const filteredDS = filterByDateAndClient(supplyierDivRatioResponse.Supplier_Diversification_Ratio_Forecast, selectedDate, selectedClient)
        const persentageDS = calculateAveragePercentage(filteredDS, 'Supplier_Diversification_Ratio')
        const filteredBenchDR = filterBenchMarkData(benchMarkData, 'Supplier_Diversification_Ratio')
        const benchMarkDR = persentageDS >= filteredBenchDR ? 'high' : 'low'
        setDivRation({ cardValue: persentageDS, benchmark: benchMarkDR })

        const divRatioResult = calculateGroupByPercentage(filteredDS, 'MATKL_Material_Category', 'Supplier_Diversification_Ratio');
        setDivRationBarchart({
          diver_ratio: divRatioResult.MATKL_Material_Category,
          client: divRatioResult.Supplier_Diversification_Ratio
        })

      }

      flagSet();
    } catch (error) {
      console.log('Error fetching data:', error);
    }
    finally {
      // setLoading(false);
    }

  };



  //------------Map Data-----------------------------------------

  const fetchPurchaseMapData = async () => {
    try {
      setLoading(true);
      const response = await apiService.purchase();
      const countriesData = {};
      response.supplier_risk_score_by_land_country.forEach((item) => {
        const landName = item.Land_Name;
        const riskScore = item.Supplier_risk_Score;
        countriesData[landName] = riskScore;
      });
      setSupplierRiskScoreLandCountry(countriesData)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
    setSelectedDate(formattedDataDate);
    fetchBenchMark();
    // fetchClients();
  }, []);

  useEffect(() => {
    fetchPurchaseData();
    fetchPurchaseMapData();
    anamolyShow();
    // fetchSupplierldtmPrdCtgotyAnomalyChatData();

  }, [clients]);

  useEffect(() => {
    fetchClients();
  }, []);

  const anamolyShow = async () => {
    try {
      const response = await apiService.SupplierRiskScoreForecastShow();
      if (response.status === 'SUCCESS' && response.anomaly.length !== 0) {

        setTimeout(() => {
          setOnAnamoly(true);
        }, 100);

        // 8 seconds in milliseconds

      }
      else {
        console.log('no anmoly');
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  const handleDateChange = async (newValue) => {
    try {
      const formattedDataDate = dayjs(newValue).format('MMM YYYY');
      setmonthYear('Selected month and year')
      setSelectedDate(formattedDataDate);

      if (selectedClient === 'All' && selectedProduct === 'All' && selectedDate) {
        console.log('condition 1');


        //-----------Risk Score---------------
        const filteredSRS = filterByDate(supplierRiskScoreApiData, formattedDataDate)
        const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
        const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
        setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

        const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
        setRiskScoreProduct({
          product_category: riskScoreResultFun.MATKL_Material_Category,
          risk_score: riskScoreResultFun.SupplierRiskScore
        })

        //-----------Quality Index---------------
        const filteredQS = filterByDate(supplierQualityIndexData, formattedDataDate)
        const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
        const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
        const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
        setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })


        const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
        setQIBarchart({
          sqi_index: qualityIndexResult.SupplierQualityIndex,
          client: qualityIndexResult.MTEXT_ClientName
        })


        //-----------Leadtime variablity---------------
        const filteredLTV = filterByDate(supplierLeadTimeVariData, formattedDataDate)
        const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')

        const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
        const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
        setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })


        const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
        setLeadTimeProduct({
          product: leadTimeResult.MATKL_Material_Category,
          lead_time: leadTimeResult.Supplier_Lead_Time_Variability
        })

        //-----------Performance Score---------------
        const filteredPS = filterByDate(supplierPerfScoreData, formattedDataDate)
        const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
        console.log('sum Per fScoreFor date-------------------------------------', sumPerfScore);
        setPerfScorechart({
          product: sumPerfScore.MATKL_Material_Category,
          perf_score: sumPerfScore.SupplierPerformanceScore
        })

        console.log('supplierPerfScoreChart-------------------------------------', supplierPerfScoreChart);


      }
      else if (selectedProduct === 'All' && selectedClient !== 'All' && selectedDate) {
        console.log('condition 2');
        //----------Risk Score------------
        const filteredSRS = filterByDateAndClient(supplierRiskScoreApiData, formattedDataDate, selectedClient)
        const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
        const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
        setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

        const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
        setRiskScoreProduct({
          product_category: riskScoreResultFun.MATKL_Material_Category,
          risk_score: riskScoreResultFun.SupplierRiskScore
        })

        //----------Quality Score------------
        const filteredQS = filterByDateAndClient(supplierQualityIndexData, formattedDataDate, selectedClient)
        const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
        const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
        const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
        setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })

        const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
        setQIBarchart({
          sqi_index: qualityIndexResult.SupplierQualityIndex,
          client: qualityIndexResult.MTEXT_ClientName
        })

        //---------Lead Time---------------------
        const filteredLTV = filterByDateAndClient(supplierLeadTimeVariData, formattedDataDate, selectedClient)
        const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')
        const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
        const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
        setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })

        const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
        setLeadTimeProduct({
          product: leadTimeResult.MATKL_Material_Category,
          lead_time: leadTimeResult.Supplier_Lead_Time_Variability
        })

        //---------Div Ratio------------
        const filteredDS = filterByDateAndClient(supplierDivRationData, formattedDataDate, selectedClient)
        const persentageDS = calculateAveragePercentage(filteredDS, 'Supplier_Diversification_Ratio')
        const filteredBenchDR = filterBenchMarkData(benchMarkData, 'Supplier_Diversification_Ratio')
        const benchMarkDR = persentageDS >= filteredBenchDR ? 'high' : 'low'
        setDivRation({ cardValue: persentageDS, benchmark: benchMarkDR })

        const divRatioResult = calculateGroupByPercentage(filteredDS, 'MATKL_Material_Category', 'Supplier_Diversification_Ratio');
        setDivRationBarchart({
          diver_ratio: divRatioResult.MATKL_Material_Category,
          client: divRatioResult.Supplier_Diversification_Ratio
        })


        //-----------Performance Score---------------
        const filteredPS = filterByDateAndClient(supplierPerfScoreData, formattedDataDate, selectedClient)
        const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
        setPerfScorechart({
          product: sumPerfScore.MATKL_Material_Category,
          perf_score: sumPerfScore.SupplierPerformanceScore
        })


      }
      else if (selectedProduct !== 'All' && selectedClient === 'All' && selectedDate) {
        //-----------Risk Score---------------
        const filteredSRS = filterByDateProduct(supplierRiskScoreApiData, formattedDataDate, selectedProduct)
        const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
        const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
        setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

        const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
        setRiskScoreProduct({
          product_category: riskScoreResultFun.MATKL_Material_Category,
          risk_score: riskScoreResultFun.SupplierRiskScore
        })

        //-----------Quality Index---------------
        const filteredQS = filterByDateProduct(supplierQualityIndexData, formattedDataDate, selectedProduct)
        const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
        const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
        const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
        setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })

        const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
        setQIBarchart({
          sqi_index: qualityIndexResult.SupplierQualityIndex,
          client: qualityIndexResult.MTEXT_ClientName
        })

        //-----------Leadtime variablity---------------
        const filteredLTV = filterByDateProduct(supplierLeadTimeVariData, formattedDataDate, selectedProduct)
        const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')
        const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
        const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
        setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })

        const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
        setLeadTimeProduct({
          product: leadTimeResult.MATKL_Material_Category,
          lead_time: leadTimeResult.Supplier_Lead_Time_Variability
        })

        //-----------Performance Score---------------
        const filteredPS = filterByDateProduct(supplierPerfScoreData, formattedDataDate, selectedProduct)
        const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
        console.log('sumPerfScore------------------------', sumPerfScore);
        setPerfScorechart({
          product: sumPerfScore.MATKL_Material_Category,
          perf_score: sumPerfScore.SupplierPerformanceScore
        })

      }
      else {
        console.log('condition else');
        //-----------Risk Score---------------
        const filteredSRS = filterByDateClientProduct(supplierRiskScoreApiData, formattedDataDate, selectedClient, selectedProduct)
        const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
        const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
        setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

        const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
        setRiskScoreProduct({
          product_category: riskScoreResultFun.MATKL_Material_Category,
          risk_score: riskScoreResultFun.SupplierRiskScore
        })

        //-----------Quality Index---------------
        const filteredQS = filterByDateClientProduct(supplierQualityIndexData, formattedDataDate, selectedClient, selectedProduct)
        const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
        const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
        const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
        setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })

        const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
        setQIBarchart({
          sqi_index: qualityIndexResult.SupplierQualityIndex,
          client: qualityIndexResult.MTEXT_ClientName
        })

        //-----------Leadtime variablity---------------
        const filteredLTV = filterByDateClientProduct(supplierLeadTimeVariData, formattedDataDate, selectedClient, selectedProduct)
        const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')
        const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
        const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
        setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })

        const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
        setLeadTimeProduct({
          product: leadTimeResult.MATKL_Material_Category,
          lead_time: leadTimeResult.Supplier_Lead_Time_Variability
        })

        //-----------Performance Score---------------
        const filteredPS = filterByDateClientProduct(supplierPerfScoreData, formattedDataDate, selectedClient, selectedProduct)
        const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
        setPerfScorechart({
          product: sumPerfScore.MATKL_Material_Category,
          perf_score: sumPerfScore.SupplierPerformanceScore
        })


      }
      flagSet();

    } catch (error) {
      console.error('Error fetching data for the selected date:', error.message);
    }
  };

  const handleClientChange = (event) => {
    const selectedValue = event
    setSelectedClient(event);

    // const selectedValue = event.target.value;
    // setSelectedClient(selectedValue);


    if (selectedValue === "All" && selectedProduct === 'All' && selectedDate) {
      // console.log('if');

      //-----------Risk Score---------------
      const filteredSRS = filterByDate(supplierRiskScoreApiData, selectedDate)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

      const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
      setRiskScoreProduct({
        product_category: riskScoreResultFun.MATKL_Material_Category,
        risk_score: riskScoreResultFun.SupplierRiskScore
      })

      //-----------Quality Index---------------
      const filteredQS = filterByDate(supplierQualityIndexData, selectedDate)
      const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
      const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
      const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
      setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })


      const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
      setQIBarchart({
        sqi_index: qualityIndexResult.SupplierQualityIndex,
        client: qualityIndexResult.MTEXT_ClientName
      })

      //-----------Leadtime variablity---------------
      const filteredLTV = filterByDate(supplierLeadTimeVariData, selectedDate)
      const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')

      const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
      const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
      setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })


      const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
      setLeadTimeProduct({
        product: leadTimeResult.MATKL_Material_Category,
        lead_time: leadTimeResult.Supplier_Lead_Time_Variability
      })

      //-----------Performance Score---------------
      const filteredPS = filterByDate(supplierPerfScoreData, selectedDate)
      const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
      setPerfScorechart({
        product: sumPerfScore.MATKL_Material_Category,
        perf_score: sumPerfScore.SupplierPerformanceScore
      })


      //---------Div Ratio------------
      const filteredDS = filterByDate(supplierDivRationData, selectedDate)
      const persentageDS = calculateAveragePercentage(filteredDS, 'Supplier_Diversification_Ratio')
      const filteredBenchDR = filterBenchMarkData(benchMarkData, 'Supplier_Diversification_Ratio')
      const benchMarkDR = persentageDS >= filteredBenchDR ? 'high' : 'low'
      setDivRation({ cardValue: persentageDS, benchmark: benchMarkDR })

      const divRatioResult = calculateGroupByPercentage(filteredDS, 'MATKL_Material_Category', 'Supplier_Diversification_Ratio');
      setDivRationBarchart({
        diver_ratio: divRatioResult.MATKL_Material_Category,
        client: divRatioResult.Supplier_Diversification_Ratio
      })


    }
    else if (selectedProduct === 'All' && selectedValue !== 'All' && selectedDate) {
      //-------Risk Score----------
      const filteredSRS = filterByDateAndClient(supplierRiskScoreApiData, selectedDate, selectedValue)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

      const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
      setRiskScoreProduct({
        product_category: riskScoreResultFun.MATKL_Material_Category,
        risk_score: riskScoreResultFun.SupplierRiskScore
      })


      //-------quality Index----------
      const filteredQS = filterByDateAndClient(supplierQualityIndexData, selectedDate, selectedValue)
      const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
      const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
      const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
      setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })


      const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
      setQIBarchart({
        sqi_index: qualityIndexResult.SupplierQualityIndex,
        client: qualityIndexResult.MTEXT_ClientName
      })

      //-------Lead  Time----------
      const filteredLTV = filterByDateAndClient(supplierLeadTimeVariData, selectedDate, selectedValue)
      const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')
      const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
      const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
      setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })

      const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
      setLeadTimeProduct({
        product: leadTimeResult.MATKL_Material_Category,
        lead_time: leadTimeResult.Supplier_Lead_Time_Variability
      })

      //-------Performance Score----------
      const filteredPS = filterByDateAndClient(supplierPerfScoreData, selectedDate, selectedValue)
      const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
      setPerfScorechart({
        product: sumPerfScore.MATKL_Material_Category,
        perf_score: sumPerfScore.SupplierPerformanceScore
      })

      //---------Div Ratio------------
      const filteredDS = filterByDateAndClient(supplierDivRationData, selectedDate, selectedValue)
      const persentageDS = calculateAveragePercentage(filteredDS, 'Supplier_Diversification_Ratio')
      const filteredBenchDR = filterBenchMarkData(benchMarkData, 'Supplier_Diversification_Ratio')
      const benchMarkDR = persentageDS >= filteredBenchDR ? 'high' : 'low'
      setDivRation({ cardValue: persentageDS, benchmark: benchMarkDR })

      const divRatioResult = calculateGroupByPercentage(filteredDS, 'MATKL_Material_Category', 'Supplier_Diversification_Ratio');
      setDivRationBarchart({
        diver_ratio: divRatioResult.MATKL_Material_Category,
        client: divRatioResult.Supplier_Diversification_Ratio
      })


    }
    else if (selectedProduct !== 'All' && selectedValue === 'All' && selectedDate) {

      console.log('else if subha')
      //-----------Risk Score---------------
      const filteredSRS = filterByDateProduct(supplierRiskScoreApiData, selectedDate, selectedProduct)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

      const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
      setRiskScoreProduct({
        product_category: riskScoreResultFun.MATKL_Material_Category,
        risk_score: riskScoreResultFun.SupplierRiskScore
      })

      //-----------Quality Index---------------
      const filteredQS = filterByDateProduct(supplierQualityIndexData, selectedDate, selectedProduct)
      const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
      const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
      const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
      setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })

      const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
      setQIBarchart({
        sqi_index: qualityIndexResult.SupplierQualityIndex,
        client: qualityIndexResult.MTEXT_ClientName
      })

      //-----------Leadtime variablity---------------
      const filteredLTV = filterByDateProduct(supplierLeadTimeVariData, selectedDate, selectedProduct)
      const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')
      const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
      const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
      setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })

      const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
      setLeadTimeProduct({
        product: leadTimeResult.MATKL_Material_Category,
        lead_time: leadTimeResult.Supplier_Lead_Time_Variability
      })

      //-----------Performance Score---------------
      const filteredPS = filterByDateProduct(supplierPerfScoreData, selectedDate, selectedProduct)
      const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
      setPerfScorechart({
        product: sumPerfScore.MATKL_Material_Category,
        perf_score: sumPerfScore.SupplierPerformanceScore
      })

      //---------Div Ratio------------
      const filteredDS = filterByDateProduct(supplierDivRationData, selectedDate, selectedProduct)
      const persentageDS = calculateAveragePercentage(filteredDS, 'Supplier_Diversification_Ratio')
      const filteredBenchDR = filterBenchMarkData(benchMarkData, 'Supplier_Diversification_Ratio')
      const benchMarkDR = persentageDS >= filteredBenchDR ? 'high' : 'low'
      setDivRation({ cardValue: persentageDS, benchmark: benchMarkDR })

      const divRatioResult = calculateGroupByPercentage(filteredDS, 'MATKL_Material_Category', 'Supplier_Diversification_Ratio');
      setDivRationBarchart({
        diver_ratio: divRatioResult.MATKL_Material_Category,
        client: divRatioResult.Supplier_Diversification_Ratio
      })

    }

    else {
      console.log('else')
      // //-------Risk Score----------
      // const filteredSRS = filterByDateAndClient(supplierRiskScoreApiData, selectedDate, selectedValue)
      // const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
      // const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
      // const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      // setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

      // const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
      // setRiskScoreProduct({
      //   product_category: riskScoreResultFun.MATKL_Material_Category,
      //   risk_score: riskScoreResultFun.SupplierRiskScore
      // })

      // //-------quality Index----------
      // const filteredQS = filterByDateAndClient(supplierQualityIndexData, selectedDate, selectedValue)
      // const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
      // const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
      // const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
      // setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })


      // const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
      // setQIBarchart({
      //   sqi_index: qualityIndexResult.SupplierQualityIndex,
      //   client: qualityIndexResult.MTEXT_ClientName
      // })

      // //-------Lead  Time----------
      // const filteredLTV = filterByDateAndClient(supplierLeadTimeVariData, selectedDate, selectedValue)
      // const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')
      // const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
      // const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
      // setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })

      // const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
      // setLeadTimeProduct({
      //   product: leadTimeResult.MATKL_Material_Category,
      //   lead_time: leadTimeResult.Supplier_Lead_Time_Variability
      // })

      // //-------Performance Score----------
      // const filteredPS = filterByDateAndClient(supplierPerfScoreData, selectedDate, selectedValue)
      // const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
      // setPerfScorechart({
      //   product: sumPerfScore.MATKL_Material_Category,
      //   perf_score: sumPerfScore.SupplierPerformanceScore
      // })



      //-----------Risk Score---------------
      const filteredSRS = filterByDateClientProduct(supplierRiskScoreApiData, selectedDate, selectedValue, selectedProduct)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

      const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
      setRiskScoreProduct({
        product_category: riskScoreResultFun.MATKL_Material_Category,
        risk_score: riskScoreResultFun.SupplierRiskScore
      })

      //-----------Quality Index---------------
      const filteredQS = filterByDateClientProduct(supplierQualityIndexData, selectedDate, selectedValue, selectedProduct)
      const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
      const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
      const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
      setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })


      const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
      setQIBarchart({
        sqi_index: qualityIndexResult.SupplierQualityIndex,
        client: qualityIndexResult.MTEXT_ClientName
      })

      //-----------Leadtime variablity---------------
      const filteredLTV = filterByDateClientProduct(supplierLeadTimeVariData, selectedDate, selectedValue, selectedProduct)
      const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')

      const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
      const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
      setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })


      const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
      setLeadTimeProduct({
        product: leadTimeResult.MATKL_Material_Category,
        lead_time: leadTimeResult.Supplier_Lead_Time_Variability
      })

      //-----------Performance Score---------------
      const filteredPS = filterByDateClientProduct(supplierPerfScoreData, selectedDate, selectedValue, selectedProduct)
      const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
      setPerfScorechart({
        product: sumPerfScore.MATKL_Material_Category,
        perf_score: sumPerfScore.SupplierPerformanceScore
      })


      //---------Div Ratio------------
      const filteredDS = filterByDateClientProduct(supplierDivRationData, selectedDate, selectedValue, selectedProduct)
      const persentageDS = calculateAveragePercentage(filteredDS, 'Supplier_Diversification_Ratio')
      const filteredBenchDR = filterBenchMarkData(benchMarkData, 'Supplier_Diversification_Ratio')
      const benchMarkDR = persentageDS >= filteredBenchDR ? 'high' : 'low'
      setDivRation({ cardValue: persentageDS, benchmark: benchMarkDR })

      const divRatioResult = calculateGroupByPercentage(filteredDS, 'MATKL_Material_Category', 'Supplier_Diversification_Ratio');
      setDivRationBarchart({
        diver_ratio: divRatioResult.MATKL_Material_Category,
        client: divRatioResult.Supplier_Diversification_Ratio
      })


    }
    flagSet();
  };

  const productChange = async (selectedValue) => {
    setSelectedProduct(selectedValue)
    const selectedProductCategory = selectedValue

    if (selectedClient === "All" && selectedProductCategory === 'All' && selectedDate) {
      // console.log('if');

      //-----------Risk Score---------------
      const filteredSRS = filterByDate(supplierRiskScoreApiData, selectedDate)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

      const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
      setRiskScoreProduct({
        product_category: riskScoreResultFun.MATKL_Material_Category,
        risk_score: riskScoreResultFun.SupplierRiskScore
      })

      //-----------Quality Index---------------
      const filteredQS = filterByDate(supplierQualityIndexData, selectedDate)
      const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
      const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
      const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
      setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })


      const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
      setQIBarchart({
        sqi_index: qualityIndexResult.SupplierQualityIndex,
        client: qualityIndexResult.MTEXT_ClientName
      })

      //-----------Leadtime variablity---------------
      const filteredLTV = filterByDate(supplierLeadTimeVariData, selectedDate)
      const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')

      const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
      const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
      setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })


      const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
      setLeadTimeProduct({
        product: leadTimeResult.MATKL_Material_Category,
        lead_time: leadTimeResult.Supplier_Lead_Time_Variability
      })

      //-----------Performance Score---------------
      const filteredPS = filterByDate(supplierPerfScoreData, selectedDate)
      const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
      setPerfScorechart({
        product: sumPerfScore.MATKL_Material_Category,
        perf_score: sumPerfScore.SupplierPerformanceScore
      })

      //---------Div Ratio------------
      const filteredDS = filterByDate(supplierDivRationData, selectedDate)
      const persentageDS = calculateAveragePercentage(filteredDS, 'Supplier_Diversification_Ratio')
      const filteredBenchDR = filterBenchMarkData(benchMarkData, 'Supplier_Diversification_Ratio')
      const benchMarkDR = persentageDS >= filteredBenchDR ? 'high' : 'low'
      setDivRation({ cardValue: persentageDS, benchmark: benchMarkDR })

      const divRatioResult = calculateGroupByPercentage(filteredDS, 'MATKL_Material_Category', 'Supplier_Diversification_Ratio');
      setDivRationBarchart({
        diver_ratio: divRatioResult.MATKL_Material_Category,
        client: divRatioResult.Supplier_Diversification_Ratio
      })

    }

    else if (selectedProductCategory === 'All' && selectedClient !== 'All' && selectedDate) {
      console.log('if log');
      //-----------Risk Score---------------
      const filteredSRS = filterByDateAndClient(supplierRiskScoreApiData, selectedDate, selectedClient)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

      const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
      setRiskScoreProduct({
        product_category: riskScoreResultFun.MATKL_Material_Category,
        risk_score: riskScoreResultFun.SupplierRiskScore
      })

      //-----------Quality Index---------------
      const filteredQS = filterByDateAndClient(supplierQualityIndexData, selectedDate, selectedClient)
      const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
      const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
      const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
      setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })

      const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
      setQIBarchart({
        sqi_index: qualityIndexResult.SupplierQualityIndex,
        client: qualityIndexResult.MTEXT_ClientName
      })

      //-----------Leadtime variablity---------------
      const filteredLTV = filterByDateAndClient(supplierLeadTimeVariData, selectedDate, selectedClient)
      const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')
      const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
      const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
      setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })

      const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
      setLeadTimeProduct({
        product: leadTimeResult.MATKL_Material_Category,
        lead_time: leadTimeResult.Supplier_Lead_Time_Variability
      })

      //-----------Performance Score---------------
      const filteredPS = filterByDateAndClient(supplierPerfScoreData, selectedDate, selectedClient)
      const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
      setPerfScorechart({
        product: sumPerfScore.MATKL_Material_Category,
        perf_score: sumPerfScore.SupplierPerformanceScore
      })

      //---------Div Ratio------------
      const filteredDS = filterByDateAndClient(supplierDivRationData, selectedDate, selectedClient)
      const persentageDS = calculateAveragePercentage(filteredDS, 'Supplier_Diversification_Ratio')
      const filteredBenchDR = filterBenchMarkData(benchMarkData, 'Supplier_Diversification_Ratio')
      const benchMarkDR = persentageDS >= filteredBenchDR ? 'high' : 'low'
      setDivRation({ cardValue: persentageDS, benchmark: benchMarkDR })

      const divRatioResult = calculateGroupByPercentage(filteredDS, 'MATKL_Material_Category', 'Supplier_Diversification_Ratio');
      setDivRationBarchart({
        diver_ratio: divRatioResult.MATKL_Material_Category,
        client: divRatioResult.Supplier_Diversification_Ratio
      })

    }
    else if (selectedClient === 'All' && selectedProductCategory !== 'All' && selectedDate) {
      console.log('client all');
      //-----------Risk Score---------------
      const filteredSRS = filterByDateProduct(supplierRiskScoreApiData, selectedDate, selectedProductCategory)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

      const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
      setRiskScoreProduct({
        product_category: riskScoreResultFun.MATKL_Material_Category,
        risk_score: riskScoreResultFun.SupplierRiskScore
      })

      //-----------Quality Index---------------
      const filteredQS = filterByDateProduct(supplierQualityIndexData, selectedDate, selectedProductCategory)
      const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
      const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
      const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
      setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })

      const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
      setQIBarchart({
        sqi_index: qualityIndexResult.SupplierQualityIndex,
        client: qualityIndexResult.MTEXT_ClientName
      })

      //-----------Leadtime variablity---------------
      const filteredLTV = filterByDateProduct(supplierLeadTimeVariData, selectedDate, selectedProductCategory)
      const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')
      const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
      const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
      setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })

      const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
      setLeadTimeProduct({
        product: leadTimeResult.MATKL_Material_Category,
        lead_time: leadTimeResult.Supplier_Lead_Time_Variability
      })

      //-----------Performance Score---------------
      const filteredPS = filterByDateProduct(supplierPerfScoreData, selectedDate, selectedProductCategory)
      const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
      setPerfScorechart({
        product: sumPerfScore.MATKL_Material_Category,
        perf_score: sumPerfScore.SupplierPerformanceScore
      })

      //---------Div Ratio------------
      const filteredDS = filterByDateProduct(supplierDivRationData, selectedDate, selectedProductCategory)
      const persentageDS = calculateAveragePercentage(filteredDS, 'Supplier_Diversification_Ratio')
      const filteredBenchDR = filterBenchMarkData(benchMarkData, 'Supplier_Diversification_Ratio')
      const benchMarkDR = persentageDS >= filteredBenchDR ? 'high' : 'low'
      setDivRation({ cardValue: persentageDS, benchmark: benchMarkDR })

      const divRatioResult = calculateGroupByPercentage(filteredDS, 'MATKL_Material_Category', 'Supplier_Diversification_Ratio');
      setDivRationBarchart({
        diver_ratio: divRatioResult.MATKL_Material_Category,
        client: divRatioResult.Supplier_Diversification_Ratio
      })

    }
    else {
      console.log('else if log');
      //-----------Risk Score---------------
      const filteredSRS = filterByDateClientProduct(supplierRiskScoreApiData, selectedDate, selectedClient, selectedProductCategory)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'SupplierRiskScore')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'SupplierRiskScore')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setSupplierRiskScore({ cardValue: persentageSRS, benchmark: benchMark })

      const riskScoreResultFun = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'SupplierRiskScore');
      setRiskScoreProduct({
        product_category: riskScoreResultFun.MATKL_Material_Category,
        risk_score: riskScoreResultFun.SupplierRiskScore
      })

      //-----------Quality Index---------------
      const filteredQS = filterByDateClientProduct(supplierQualityIndexData, selectedDate, selectedClient, selectedProductCategory)
      const persentageQS = calculateAveragePercentage(filteredQS, 'SupplierQualityIndex')
      const filteredBenchQS = filterBenchMarkData(benchMarkData, 'Supplier_Quality_Index')
      const benchMarkQS = persentageQS >= filteredBenchQS ? 'high' : 'low'
      setQualityIndex({ cardValue: persentageQS, benchmark: benchMarkQS })

      const qualityIndexResult = calculateGroupByPercentage(filteredQS, 'MTEXT_ClientName', 'SupplierQualityIndex');
      setQIBarchart({
        sqi_index: qualityIndexResult.SupplierQualityIndex,
        client: qualityIndexResult.MTEXT_ClientName
      })

      //-----------Leadtime variablity---------------
      const filteredLTV = filterByDateClientProduct(supplierLeadTimeVariData, selectedDate, selectedClient, selectedProductCategory)
      const persentageLTV = calculateAverage(filteredLTV, 'Supplier_Lead_Time_Variability')
      const filteredBenchLT = filterBenchMarkData(benchMarkData, 'Supplier_Lead_Time_Variability')
      const benchMarkLT = persentageLTV >= filteredBenchLT ? 'high' : 'low'
      setLeadTimeVari({ cardValue: persentageLTV, benchmark: benchMarkLT })

      const leadTimeResult = calculateGroupByAverage(filteredLTV, 'MATKL_Material_Category', 'Supplier_Lead_Time_Variability');
      setLeadTimeProduct({
        product: leadTimeResult.MATKL_Material_Category,
        lead_time: leadTimeResult.Supplier_Lead_Time_Variability
      })

      //-----------Performance Score---------------
      const filteredPS = filterByDateClientProduct(supplierPerfScoreData, selectedDate, selectedClient, selectedProductCategory)
      const sumPerfScore = calculateGroupByPercentage(filteredPS, 'MATKL_Material_Category', 'SupplierPerformanceScore');
      setPerfScorechart({
        product: sumPerfScore.MATKL_Material_Category,
        perf_score: sumPerfScore.SupplierPerformanceScore
      })

      //---------Div Ratio------------
      const filteredDS = filterByDateClientProduct(supplierDivRationData, selectedDate, selectedClient, selectedProductCategory)
      const persentageDS = calculateAveragePercentage(filteredDS, 'Supplier_Diversification_Ratio')
      const filteredBenchDR = filterBenchMarkData(benchMarkData, 'Supplier_Diversification_Ratio')
      const benchMarkDR = persentageDS >= filteredBenchDR ? 'high' : 'low'
      setDivRation({ cardValue: persentageDS, benchmark: benchMarkDR })

      const divRatioResult = calculateGroupByPercentage(filteredDS, 'MATKL_Material_Category', 'Supplier_Diversification_Ratio');
      setDivRationBarchart({
        diver_ratio: divRatioResult.MATKL_Material_Category,
        client: divRatioResult.Supplier_Diversification_Ratio
      })



    }
    flagSet();
  };

  return (
    <Box m="20px" sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={3} md={3}>
          <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "0 0 5px 5px" }} >Purchase</Typography>
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
              // onChange={(event) => {
              //   // props.client_change(event.target.value);
              //   handleDateChange(event);
              // }}
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
              label="Supplier Name"
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
                <MenuItem key={i} value={client.MTEXT_ClientName}>
                  {client.MTEXT_ClientName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} md={3}>
          {/* <ProductSelect product_change={productChange} /> */}
          <FormControl fullWidth>
            <InputLabel id="client-select-label"> Raw Products Category</InputLabel>
            <Select
              labelId="client-select-label"
              id="client-select"
              value={selectedProduct}
              label="Raw Products Category"
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
        <Grid item xs={4} md={4} lg={3}>

          <GlobalCard title="Supplier Quality Score "
            subtitle={supplierQualityIndex.cardValue !== null ? supplierQualityIndex.cardValue.toString() : 'Loading...'}
            tooltipContent="A measure of the quality of materials received from suppliers."
            units='%'
            benchmark={supplierQualityIndex.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
        <Grid item xs={4} md={4} lg={3}>
          <GlobalCard title="Supplier Risk Score"
            subtitle={supplierRiskScore.cardValue !== null ? supplierRiskScore.cardValue.toString() : 'Loading...'}
            tooltipContent="This involves evaluating the likelihood and impact of potential risks"
            units='%'
            benchmark={supplierRiskScore.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}

          />
        </Grid>
        <Grid item xs={4} md={4} lg={3}>
          <GlobalCard title="Lead Time Variability"
            subtitle={supplierLeadTimeVari.cardValue !== null ? supplierLeadTimeVari.cardValue.toString() : 'Loading...'}
            tooltipContent="The variation in lead time for deliveries from suppliers"
            units='Days'

            benchmark={supplierLeadTimeVari.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
        <Grid item xs={4} md={4} lg={3}>
          <GlobalCard title="Diversification Ratio"
            subtitle={supplierDivRation.cardValue !== null ? supplierDivRation.cardValue.toString() : 'Loading...'}
            tooltipContent="A measure of the extent to which procurement relies on a single supplier."
            units='%'
            benchmark={supplierDivRation.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={6} md={6}>
          <ColumnChart
            series={riskScoreProduct.risk_score}
            labels={riskScoreProduct.product_category}
            flag={riskScoreProductLoder}
            tilesLables="Supplier Risk Score by Product Category"
            notificationStatus={onShowAnamoly ? true : false}
            height="350"
          />
        </Grid>
        <Grid item xs={6} md={6} >
          <BarCharts
            labels={supplierLeadTimeProduct.product}
            series={supplierLeadTimeProduct.lead_time}
            flag={supplierLeadTimeProductLoder}
            tilesLables="Supplier Lead Time Variability By Product Category"
            height='350'
            legend='Supplier Lead Time Variability (Days)'
            
            format_func={formatDays}
          />
        </Grid>


        <Grid item xs={6} md={6}>

          <DistributedColumnChart
            labels={supplierPerfScoreChart.product}
            series={supplierPerfScoreChart.perf_score}
            flag={dccLoder}
            height='350'
            tilesLables="Supplier On Time Delivery Performance Score by Product Category"
            legend='Supplier Performance Score (%)'
            format_func={formatPersentage}
          />
        </Grid>

        <Grid item xs={6} md={6}>


          <ColumnChart
            labels={supplierQIBarChart.client}
            series={supplierQIBarChart.sqi_index}
            flag={supplierQIBarChartLoder}
            tilesLables="Supplier Quality Score by Supplier Name"
            height="350"
          />
        </Grid>



        <Grid item xs={6} md={6}>

          <PieCharts
            series={supplierDivRatioBarChart.client}
            labels={supplierDivRatioBarChart.diver_ratio}
            flag={supplierDivRatioBarChartLoder}
            tilesLables="Supplier Diversification Ratio by Product Category"
            height='320' />
        </Grid>
        <Grid item xs={6} md={6}>

          <WorldMap mapData={supplierRiskScoreLandCountry} tilesLables="Supplier Risk Score by Land Country" />
        </Grid>


      </Grid>

    </Box>
  );
};


export default Purchase;