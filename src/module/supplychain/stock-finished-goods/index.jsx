import { Box, useTheme, Grid, Typography } from "@mui/material";
import React from "react";
import { tokens } from "../../../theme";
import { useState, useEffect } from "react";
import GlobalCard from "../../../components/GlobalCard";
import PieCharts from "../../../components/charts/PieCharts";
import { apiService } from '../../../service/api-service';
import SimpleBackdrop from "../../../scenes/global/Loader";
import DistributedColumnChart from "../../../components/charts/DistributedColumnChart";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {
  formatDays,
  calculateAveragePercentage,
  calculateGroupByPercentage,
  filterBenchMarkData,
  filterByDate,
  filterByDatePlant,
  filterByDatePlantProduct,
  calculateAverage,
  filterByDateProduct,
  calculateGroupByAverage,
  transformDataForChart

} from "../../../utils/GlobalFilters";
//----------------------For Date filter -------------------------------
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLocation } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import '../../../style/GlobalStyle.css'
import { modifyData } from "../../../DataModifyer";
import LineChart from "../../../components/charts/Linechart";


const columns = [
  { id: '>90 Days', label: '>90 Days', minWidth: 170 },
  { id: '60-90 Days', label: '60-90 Days', minWidth: 170 },
  { id: '<60 Days', label: '<60 Days', minWidth: 170 },
];

const StockFinishedGoods = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [selectedProduct, setSelectedProduct] = useState('')
  const [plants, setPlants] = useState([]);
  const [products, setproducts] = useState([]);


  const [selectedPlants, setSelectedPlants] = useState('');

  const [selectedtable, setSelectedtable] = useState('');

  //-------------------Back Order Rate------------------------
  // const [backOrderRateData, setBackOrderRateData] = useState([])
  // const [backOrderRate, setBackOrderRate] = useState({ cardValue: null, benchmark: null })

  //-------------------- Bench mark----------------
  const [benchMarkData, setBenchMarkData] = useState([])

  //--------------------InventoryTurnover-----------------------
  const [inventoryTurnData, setInventoryTurnData] = useState([])
  const [inventoryTurn, setInventoryTurn] = useState({ cardValue: null, benchmark: null })
  const [inventoryTurnChart, setInventoryTurnChart] = useState({
    MATKL_Material_Category: [],
    InventoryTurnover: []
  })
  const [inventoryTurnChartLoder, setInventoryTurnChartLoder] = useState(0)

  //--------------------Cash To Cash Cycle Time By Position Key Year----------------
  const [cashCycleData, setCashCycleData] = useState([])
  const [cashCycle, setCashCycle] = useState({ cardValue: null, benchmark: null })
  const [cashCycleChart, setCashCycleChart] = useState({
    CashToCashCycleTime: [],
    Position_Key_Year: []
  })
  const [cashCycleChartLoder, setCashCycleChartLoder] = useState(0)

  //------------Stock to Sales ratio---------------
  const [salesRatioData, setSalesRatioData] = useState([])
  const [salesRatioCard, setSalesRatioCard] = useState({ cardValue: null, benchmark: null })
  //------------InventoryAgeData---------------
  const [inventoryAgeData, setInventoryAgeData] = useState([])
  const [inventoryAgeCard, setInventoryAgeCard] = useState({ cardValue: null, benchmark: null })


  //----------------------For Date filter -------------------------------
  const [selectedDate, setSelectedDate] = useState('');
  const [monthYear, setmonthYear] = useState('Select month and year')
  const currentDate = new Date();
  const showAllOption = true; // or false, depending on your requirement

  //-----------------------For Tabular data view
  const [tabularData, settabularData] = useState([])

  // *****************Despatch_Rate_Forecast***************
  const [lineChartStatus, setlineChartStatus] = useState(0)

  const [despatchRateData, setDespatchRateData] = useState([])
  const [despatchRate, setDespatchRate] = useState({ MATKL_Material_Category: [], Despatch_Rate: [] })


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value, 10);
    setPage(0);
  };

  const formatNumberWithCommasAndRound = (value, decimalPlaces) => {
    const roundedValue = Number(value).toFixed(decimalPlaces);
    return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatNumberWithCommasTooltip = (value) => {
    const formattedNumber = parseFloat(value).toFixed(2);
    return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // const Finished_Goods_Total_Cost_Amount_Wise_Tabular_DataAPI = async () => {
  //   const respons = await apiService.Finished_Goods_Total_Cost_Amount_Wise_Tabular_Data()
  //   console.log("Finished_Goods_Total_Cost_Amount_Wise_Tabular_DataAPI: ", respons)
  //   if (respons) {
  //     settabularData(modifyData(respons.Finished_Goods_Total_Cost_Amount_Wise_Tabular_Data))
  //   }
  // }

  const Finished_Goods_Total_Cost_Amount_Wise_Tabular_DataAPI = async (selectedtable) => {

    console.log('selected from drp', selectedtable);
    try {

      const requestData = {
        plant_Name: selectedtable,
      };

      const response = await apiService.Finished_Goods_Total_Cost_Amount_Wise_Tabular_Data(requestData);

      console.log("Finished_Goods_Total_Cost_Amount_Wise_Tabular_DataAPI Response:", response);

      if (response) {
        settabularData(modifyData(response.Finished_Goods_Total_Cost_Amount_Wise_Tabular_Data));
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      // Handle the error as needed
    }
  };

  const fetchPlants = async () => {
    try {
      const response = await apiService.filterdropdown();
      const productsData = response.Product_Category || [];
      setproducts(productsData);
      setSelectedProduct("All");
      const plantsData = response.plants || [];
      setPlants(plantsData);
      const supplierFromUrl = searchParams.get('plant') || '';
      if (supplierFromUrl) {
        // console.log('params exist',supplierFromUrl);
        setSelectedPlants(supplierFromUrl);
      }
      else
        if (plantsData.length > 0) {
          setSelectedPlants(plantsData[0].NAME1);
        }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchBenchMark = async () => {
    //--------------------Bench Mark -----------------------
    const benchMarkResponse = await apiService.benchmarkShow();
    // console.log('benchMarkResponse', benchMarkResponse);
    if (benchMarkResponse.status === "Success") {
      setBenchMarkData(benchMarkResponse.client)
    }
  }


  const fetchData = async () => {
    try {
      // setLoading(true);
      //   ------------Back Order Rate---------------
      // const backOrderRateResponse = await apiService.backOrderRate();
      // setBackOrderRateData(backOrderRateResponse.Back_order_rate_Forecast)
      // if (backOrderRateResponse.status === 'success' && selectedPlants !== '' && selectedDate && benchMarkData) {
      //   const filteredBOR = filterByDatePlant(backOrderRateResponse.Back_order_rate_Forecast, selectedDate, selectedPlants)
      //   const persentageBOR = calculateAveragePercentage(filteredBOR, 'BackOrderRate')
      //   const filteredBenchMark = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      //   const benchMark = persentageBOR >= filteredBenchMark ? 'high' : 'low'
      //   setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMark })
      // }

      //--------------------Inventory Turnover----------------
      const inventoryTurnOverResponse = await apiService.InventoryTurnoverStockedFG();
      setInventoryTurnData(inventoryTurnOverResponse.InventoryTurnover_Forecast_Product)
      if (inventoryTurnOverResponse.status === 'success' && selectedPlants !== '' && selectedDate && benchMarkData) {
        const filteredIT = filterByDatePlant(inventoryTurnOverResponse.InventoryTurnover_Forecast_Product, selectedDate, selectedPlants)

        const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
        const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
        const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
        setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
        //console.log("setInventoryTurn",inventoryTurn);
        const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
        setInventoryTurnChart({
          MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
          InventoryTurnover: sumInvTurn.InventoryTurnover
        })
        //console.log("sumInvTurn",sumInvTurn);

      }
      //------------Cash To Cash Cycle Time By Position Key Year---------------
      const cashCycleResponse = await apiService.CashCycle();
      setCashCycleData(cashCycleResponse.CashToCashCycleTimeByPositionKeyYear_Forecast)
      if (cashCycleResponse.status === 'success' && selectedPlants !== '' && selectedDate && benchMarkData) {
        const filteredCashCycle = filterByDatePlant(cashCycleResponse.CashToCashCycleTimeByPositionKeyYear_Forecast, selectedDate, selectedPlants)
        // console.log('filteredCashCycle in fetch data',filteredCashCycle);
        const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
        const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
        const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'
        setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
        const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');
        // console.log('in fetch data sumCashCycle ',sumCashCycle);
        setCashCycleChart({
          CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
          Position_Key_Year: sumCashCycle.Position_Key_Year
        })
      }

      //--------------------Stock to Sales Ratio --------------------
      const salesRatioResponse = await apiService.StocktoSalesRatio();
      setSalesRatioData(salesRatioResponse.StocktoSalesRatio_Forecast)
      if (salesRatioResponse.status === 'success' && selectedPlants !== '' && selectedDate && benchMarkData) {
        const filteredQS = filterByDatePlant(salesRatioResponse.StocktoSalesRatio_Forecast, selectedDate, selectedPlants)
        const persentageQS = calculateAveragePercentage(filteredQS, 'StocktoSalesRatio')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
        const benchMark = persentageQS >= filteredBenchMark ? 'high' : 'low'
        setSalesRatioCard({ cardValue: persentageQS, benchmark: benchMark })
      }

      //--------------------InventoryAge --------------------
      const inventoryAgeResponse = await apiService.InventoryAge();
      setInventoryAgeData(inventoryAgeResponse.InventoryAgeInDays_Forecast)
      if (inventoryAgeResponse.status === 'success' && selectedPlants !== '' && selectedDate && benchMarkData) {
        const filteredIA = filterByDatePlant(inventoryAgeResponse.InventoryAgeInDays_Forecast, selectedDate, selectedPlants)
        const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
        const benchMark = avarageIA >= filteredBenchMark ? 'high' : 'low'
        setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMark })
      }

      // -------------------------Despatch Rate------------------------------
      const despatchRateResponse = await apiService.Despatch_Rate();
      console.log('despatchRateResponse', despatchRateResponse);
      setDespatchRateData(despatchRateResponse.Despatch_Rate_Forecast)
      if (despatchRateResponse.status === 'success' && selectedPlants !== '' && selectedDate) {
        const filteredDR = filterByDatePlant(despatchRateResponse.Despatch_Rate_Forecast, selectedDate, selectedPlants)

        console.log('filteredDR', filteredDR);

        const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');

        // console.log('series',series);
        // console.log('labelcategory',labelcategory);

        setDespatchRate({
          MATKL_Material_Category: labelcategory,
          Despatch_Rate: series
        })
      }


      // -----------------------tablel data----------------------------------
      if (selectedPlants !== '') {
        console.log('in fetch data function ', selectedPlants);
        Finished_Goods_Total_Cost_Amount_Wise_Tabular_DataAPI(selectedPlants)
      }



      flagSet();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchMark();
    fetchPlants();
    Finished_Goods_Total_Cost_Amount_Wise_Tabular_DataAPI(selectedtable)
    // fetchPlants();

  }, []);

  useEffect(() => {
    const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
    setSelectedDate(formattedDataDate);
    fetchData();
    return () => {
    };

  }, [plants]);



  //--------------------Date Filter----------------

  const handleDateChange = async (newValue) => {
    try {
      const formattedDataDate = dayjs(newValue).format('MMM YYYY');
      setmonthYear('Selected month and year')
      setSelectedDate(formattedDataDate);

      if (selectedPlants === 'All' && selectedProduct === 'All' && selectedDate) {

        //--------------------InventoryTurnover-----------------------
        const filteredIT = filterByDate(inventoryTurnData, formattedDataDate)
        const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
        const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
        const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
        setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
        const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
        setInventoryTurnChart({
          MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
          InventoryTurnover: sumInvTurn.InventoryTurnover
        })

        //--------------------Cash To Cash Cycle Time By Position Key Year----------------
        const filteredCashCycle = filterByDate(cashCycleData, formattedDataDate)
        const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
        const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
        const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'
        setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
        const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');
        setCashCycleChart({
          CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
          Position_Key_Year: sumCashCycle.Position_Key_Year
        })


        //--------------------Stock to Sales Ratio --------------------
        const filteredSTSR = filterByDate(salesRatioData, formattedDataDate)
        const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
        const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
        const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
        setSalesRatioCard({ cardValue: persentageSTSR, benchmark: benchMarkSTSR })
        // console.log("SalesRatioCard",salesRatioCard);

        //--------------------Inventory Age --------------------
        const filteredIA = filterByDate(inventoryAgeData, formattedDataDate)
        const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
        const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
        const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
        setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })

        // -------------------------Despatch Rate------------------------------
        const filteredDR = filterByDate(despatchRateData, formattedDataDate)
        const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
        setDespatchRate({
          MATKL_Material_Category: labelcategory,
          Despatch_Rate: series
        })


      }
      else if (selectedProduct === 'All' && selectedPlants !== 'All' && selectedDate) {
        //   ------------Back Order Rate---------------
        // const filteredBOR = filterByDatePlant(backOrderRateData, formattedDataDate, selectedPlants)
        // const persentageBOR = calculateAveragePercentage(filteredBOR, 'BackOrderRate')
        // const filteredBenchMark = filterBenchMarkData(benchMarkData, 'BackOrderRate')
        // const benchMark = persentageBOR >= filteredBenchMark ? 'high' : 'low'
        // setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMark })

        //--------------------InventoryTurnover-----------------------
        const filteredIT = filterByDatePlant(inventoryTurnData, formattedDataDate, selectedPlants)
        const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
        const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
        const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
        setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
        const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
        setInventoryTurnChart({
          MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
          InventoryTurnover: sumInvTurn.InventoryTurnover
        })

        //--------------------Cash To Cash Cycle Time By Position Key Year----------------
        const filteredCashCycle = filterByDatePlant(cashCycleData, formattedDataDate, selectedPlants)
        // console.log("filteredCashCycle",filteredCashCycle);
        const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
        const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
        const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'
        setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
        const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');
        setCashCycleChart({
          CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
          Position_Key_Year: sumCashCycle.Position_Key_Year
        })


        //--------------------Stock to Sales Ratio --------------------
        const filteredSTSR = filterByDatePlant(salesRatioData, formattedDataDate, selectedPlants)
        const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
        const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
        const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
        setSalesRatioCard({ cardValue: persentageSTSR, benchmark: benchMarkSTSR })
        // console.log("SalesRatioCard",salesRatioCard);

        //--------------------Inventory Age --------------------
        const filteredIA = filterByDatePlant(inventoryAgeData, formattedDataDate, selectedPlants)
        const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
        const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
        const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
        setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })

        // -------------------------Despatch Rate------------------------------
        const filteredDR = filterByDatePlant(despatchRateData, formattedDataDate, selectedPlants)
        const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
        setDespatchRate({
          MATKL_Material_Category: labelcategory,
          Despatch_Rate: series
        })


      }
      else if (selectedProduct !== 'All' && selectedPlants === 'All' && selectedDate) {

        //--------------------InventoryTurnover-----------------------
        const filteredIT = filterByDateProduct(inventoryTurnData, formattedDataDate, selectedProduct)
        const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
        const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
        const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
        setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
        const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
        setInventoryTurnChart({
          MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
          InventoryTurnover: sumInvTurn.InventoryTurnover
        })

        //--------------------Cash To Cash Cycle Time By Position Key Year----------------
        const filteredCashCycle = filterByDateProduct(cashCycleData, formattedDataDate, selectedProduct)
        const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
        const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
        const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'
        setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
        const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');
        setCashCycleChart({
          CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
          Position_Key_Year: sumCashCycle.Position_Key_Year
        })


        //--------------------Stock to Sales Ratio --------------------
        const filteredSTSR = filterByDateProduct(salesRatioData, formattedDataDate, selectedProduct)
        const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
        const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
        const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
        setSalesRatioCard({ cardValue: persentageSTSR, benchmark: benchMarkSTSR })

        //--------------------Inventory Age --------------------
        const filteredIA = filterByDateProduct(inventoryAgeData, formattedDataDate, selectedProduct)
        const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
        const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
        const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
        setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })

        // -------------------------Despatch Rate------------------------------
        const filteredDR = filterByDateProduct(despatchRateData, formattedDataDate, selectedProduct)
        const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
        setDespatchRate({
          MATKL_Material_Category: labelcategory,
          Despatch_Rate: series
        })


      }
      else {

        //--------------------InventoryTurnover-----------------------
        const filteredIT = filterByDatePlantProduct(inventoryTurnData, formattedDataDate, selectedPlants, selectedProduct)
        const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
        const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
        const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
        setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
        const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
        setInventoryTurnChart({
          MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
          InventoryTurnover: sumInvTurn.InventoryTurnover
        })

        //--------------------Cash To Cash Cycle Time By Position Key Year----------------
        const filteredCashCycle = filterByDatePlantProduct(cashCycleData, formattedDataDate, selectedPlants, selectedProduct)
        const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
        const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
        const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'
        setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
        const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');
        setCashCycleChart({
          CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
          Position_Key_Year: sumCashCycle.Position_Key_Year
        })


        //--------------------Stock to Sales Ratio --------------------
        const filteredSTSR = filterByDatePlantProduct(salesRatioData, formattedDataDate, selectedPlants, selectedProduct)
        const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
        const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
        const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
        setSalesRatioCard({ cardValue: persentageSTSR, benchmark: benchMarkSTSR })

        //--------------------Inventory Age --------------------
        const filteredIA = filterByDatePlantProduct(inventoryAgeData, formattedDataDate, selectedPlants, selectedProduct)
        const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
        const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
        const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
        setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })

        // -------------------------Despatch Rate------------------------------
        const filteredDR = filterByDatePlantProduct(despatchRateData, formattedDataDate, selectedPlants, selectedProduct)
        const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
        setDespatchRate({
          MATKL_Material_Category: labelcategory,
          Despatch_Rate: series
        })


      }

    } catch (error) {
      console.error('Error fetching data for the selected date:', error.message);
    }
    flagSet();
  };

  const handlePlantChange = (event) => {
    const selectedValue = event
    setSelectedPlants(event);

    const selectedtable = event === 'All' ? '' : event;
    console.log('selectedtable', selectedtable);
    setSelectedtable(event);


    // setSelectedtable(event === 'All' ? '' : event);
    // Call the API with the dynamically chosen plant name
    Finished_Goods_Total_Cost_Amount_Wise_Tabular_DataAPI(selectedtable);

    if (selectedValue === "All" && selectedProduct === 'All' && selectedDate) {
      // console.log('if part')
      //   ------------Back Order Rate---------------
      // const filteredBOR = filterByDate(backOrderRateData, selectedDate)
      // const persentageBOR = calculateAveragePercentage(filteredBOR, 'BackOrderRate')
      // const filteredBenchMark = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      // const benchMark = persentageBOR >= filteredBenchMark ? 'high' : 'low'
      // setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMark })

      //--------------------Inventory Turnover-----------------------
      const filteredIT = filterByDate(inventoryTurnData, selectedDate)
      const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
      const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
      setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
      //console.log("setInventoryTurn",inventoryTurn);
      const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryTurnChart({
        MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
        InventoryTurnover: sumInvTurn.InventoryTurnover
      })


      //--------------------Cash To Cash Cycle Time By Position Key Year----------------
      const filteredCashCycle = filterByDate(cashCycleData, selectedDate)
      const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
      const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'
      setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
      const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');
      setCashCycleChart({
        CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
        Position_Key_Year: sumCashCycle.Position_Key_Year
      })

      //--------------------Stock to Sales Ratio --------------------
      const filteredSTSR = filterByDate(salesRatioData, selectedDate)
      const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
      const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
      const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
      setSalesRatioCard({
        cardValue: persentageSTSR, benchmark: benchMarkSTSR
      })
      //--------------------Inventory Age --------------------
      const filteredIA = filterByDate(inventoryAgeData, selectedDate)
      const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
      const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
      const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
      setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })


      // -------------------------Despatch Rate------------------------------
      const filteredDR = filterByDate(despatchRateData, selectedDate)
      const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
      setDespatchRate({
        MATKL_Material_Category: labelcategory,
        Despatch_Rate: series
      })


    }
    else if (selectedProduct === 'All' && selectedValue !== 'All' && selectedDate) {
      // //   ------------Back Order Rate---------------
      // const filteredBOR = filterByDatePlant(backOrderRateData, selectedDate, selectedValue)
      // const persentageBOR = calculateAveragePercentage(filteredBOR, 'BackOrderRate')
      // const filteredBenchMark = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      // const benchMark = persentageBOR >= filteredBenchMark ? 'high' : 'low'
      // setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMark })

      //--------------------Inventory Turnover-----------------------
      const filteredIT = filterByDatePlant(inventoryTurnData, selectedDate, selectedValue)
      const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
      const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
      setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
      //console.log("setInventoryTurn",inventoryTurn);
      const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryTurnChart({
        MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
        InventoryTurnover: sumInvTurn.InventoryTurnover
      })

      //--------------------Cash To Cash Cycle Time By Position Key Year----------------
      const filteredCashCycle = filterByDatePlant(cashCycleData, selectedDate, selectedValue)
      const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
      const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'

      setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
      const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');
      setCashCycleChart({
        CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
        Position_Key_Year: sumCashCycle.Position_Key_Year
      })


      //--------------------Stock to Sales Ratio --------------------
      const filteredSTSR = filterByDatePlant(salesRatioData, selectedDate, selectedValue)
      const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
      const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
      const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
      setSalesRatioCard({ cardValue: persentageSTSR, benchmark: benchMarkSTSR })

      //--------------------Inventory Age --------------------
      const filteredIA = filterByDatePlant(inventoryAgeData, selectedDate, selectedValue)
      const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
      const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
      const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
      setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })

      // -------------------------Despatch Rate------------------------------
      const filteredDR = filterByDatePlant(despatchRateData, selectedDate, selectedValue)
      const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
      setDespatchRate({
        MATKL_Material_Category: labelcategory,
        Despatch_Rate: series
      })


    }
    else if (selectedProduct !== 'All' && selectedValue === 'All' && selectedDate) {

      // const filteredSRS = filterByDateProduct(supplierRiskScoreApiData, selectedDate, selectedProduct)
      // //   ------------Back Order Rate---------------
      // const filteredBOR = filterByDatePlant(backOrderRateData, selectedDate, selectedValue)
      // const persentageBOR = calculateAveragePercentage(filteredBOR, 'BackOrderRate')
      // const filteredBenchMark = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      // const benchMark = persentageBOR >= filteredBenchMark ? 'high' : 'low'
      // setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMark })

      //--------------------Inventory Turnover-----------------------
      const filteredIT = filterByDateProduct(inventoryTurnData, selectedDate, selectedProduct)
      const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
      const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
      setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
      //console.log("setInventoryTurn",inventoryTurn);
      const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryTurnChart({
        MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
        InventoryTurnover: sumInvTurn.InventoryTurnover
      })

      //--------------------Cash To Cash Cycle Time By Position Key Year----------------
      const filteredCashCycle = filterByDateProduct(cashCycleData, selectedDate, selectedProduct)
      const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
      const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'

      setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
      const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');
      setCashCycleChart({
        CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
        Position_Key_Year: sumCashCycle.Position_Key_Year
      })


      //--------------------Stock to Sales Ratio --------------------
      const filteredSTSR = filterByDateProduct(salesRatioData, selectedDate, selectedProduct)
      const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
      const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
      const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
      setSalesRatioCard({ cardValue: persentageSTSR, benchmark: benchMarkSTSR })

      //--------------------Inventory Age --------------------
      const filteredIA = filterByDateProduct(inventoryAgeData, selectedDate, selectedProduct)
      const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
      const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
      const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
      setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })

      // -------------------------Despatch Rate------------------------------
      const filteredDR = filterByDateProduct(despatchRateData, selectedDate, selectedProduct)
      const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
      setDespatchRate({
        MATKL_Material_Category: labelcategory,
        Despatch_Rate: series
      })

    }
    else {
      //   ------------Back Order Rate---------------
      // const filteredBOR = filterByDatePlantProduct(backOrderRateData, selectedDate, selectedValue, selectedProduct)
      // const persentageBOR = calculateAveragePercentage(filteredBOR, 'BackOrderRate')
      // const filteredBenchMark = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      // const benchMark = persentageBOR >= filteredBenchMark ? 'high' : 'low'
      // setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMark })

      //--------------------Inventory Turnover-----------------------
      const filteredIT = filterByDatePlantProduct(inventoryTurnData, selectedDate, selectedValue, selectedProduct)
      const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
      const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
      setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
      // console.log("setInventoryTurn",inventoryTurn);
      const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryTurnChart({
        MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
        InventoryTurnover: sumInvTurn.InventoryTurnover
      })

      //--------------------Cash To Cash Cycle Time By Position Key Year----------------
      const filteredCashCycle = filterByDatePlantProduct(cashCycleData, selectedDate, selectedValue, selectedProduct)
      const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
      const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'
      setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
      // console.log("setCashCycle",persentageCashCycle);
      const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');
      setCashCycleChart({
        CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
        Position_Key_Year: sumCashCycle.Position_Key_Year
      })


      //--------------------Stock to Sales Ratio --------------------
      const filteredSTSR = filterByDatePlantProduct(salesRatioData, selectedDate, selectedValue, selectedProduct)
      const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
      const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
      const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
      setSalesRatioCard({ cardValue: persentageSTSR, benchmark: benchMarkSTSR })
      //--------------------Inventory Age --------------------
      const filteredIA = filterByDatePlantProduct(inventoryAgeData, selectedDate, selectedValue, selectedProduct)
      const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
      const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
      const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
      setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })


      // -------------------------Despatch Rate------------------------------
      const filteredDR = filterByDatePlantProduct(despatchRateData, selectedDate, selectedValue, selectedProduct)
      const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
      setDespatchRate({
        MATKL_Material_Category: labelcategory,
        Despatch_Rate: series
      })

    }
    flagSet();
  };

  const productChange = async (selectedValue) => {
    setSelectedProduct(selectedValue)
    const selectedProductCategory = selectedValue

    console.log('inside product change');

    if (selectedPlants === "All" && selectedProductCategory === 'All' && selectedDate) {

      console.log('inside if');
      //--------------------Inventory Turnover-----------------------
      const filteredIT = filterByDate(inventoryTurnData, selectedDate)
      const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
      const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
      setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
      //console.log("setInventoryTurn",inventoryTurn);
      const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryTurnChart({
        MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
        InventoryTurnover: sumInvTurn.InventoryTurnover
      })


      //--------------------Cash To Cash Cycle Time By Position Key Year----------------
      const filteredCashCycle = filterByDate(cashCycleData, selectedDate)
      const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
      const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'
      setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
      const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');
      setCashCycleChart({
        CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
        Position_Key_Year: sumCashCycle.Position_Key_Year
      })

      //--------------------Stock to Sales Ratio --------------------
      const filteredSTSR = filterByDate(salesRatioData, selectedDate)
      const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
      const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
      const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
      setSalesRatioCard({
        cardValue: persentageSTSR, benchmark: benchMarkSTSR
      })
      //--------------------Inventory Age --------------------
      const filteredIA = filterByDate(inventoryAgeData, selectedDate)
      const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
      const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
      const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
      setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })


      // -------------------------Despatch Rate------------------------------
      const filteredDR = filterByDate(despatchRateData, selectedDate)
      const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
      setDespatchRate({
        MATKL_Material_Category: labelcategory,
        Despatch_Rate: series
      })



    }

    else if (selectedProductCategory === 'All' && selectedPlants !== 'All' && selectedDate) {
      console.log('inside else if 1');

      //--------------------Inventory Turnover-----------------------
      const filteredIT = filterByDatePlant(inventoryTurnData, selectedDate, selectedPlants)
      const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
      const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
      setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
      const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryTurnChart({
        MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
        InventoryTurnover: sumInvTurn.InventoryTurnover
      })

      //--------------------Cash To Cash Cycle Time By Position Key Year----------------
      const filteredCashCycle = filterByDatePlant(cashCycleData, selectedDate, selectedPlants)
      const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
      const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'
      setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
      //console.log("setCashCycle",cashCycle);
      const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');

      // console.log('sumCashCycle',sumCashCycle)
      setCashCycleChart({
        CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
        Position_Key_Year: sumCashCycle.Position_Key_Year
      })

      //--------------------Stock to Sales Ratio --------------------
      const filteredSTSR = filterByDatePlant(salesRatioData, selectedDate, selectedPlants)
      const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
      const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
      const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
      setSalesRatioCard({ cardValue: persentageSTSR, benchmark: benchMarkSTSR })
      //--------------------Inventory Age --------------------
      const filteredIA = filterByDatePlant(inventoryAgeData, selectedDate, selectedPlants)
      const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
      const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
      const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
      setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })

      // -------------------------Despatch Rate------------------------------
      const filteredDR = filterByDatePlant(despatchRateData, selectedDate, selectedPlants)
      const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
      setDespatchRate({
        MATKL_Material_Category: labelcategory,
        Despatch_Rate: series
      })


    }
    else if (selectedPlants === 'All' && selectedProductCategory !== 'All' && selectedDate) {
      console.log('inside else if 2');


      // //--------------------Inventory Turnover-----------------------
      const filteredIT = filterByDateProduct(inventoryTurnData, selectedDate, selectedProductCategory)
      const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
      const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
      setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
      const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryTurnChart({
        MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
        InventoryTurnover: sumInvTurn.InventoryTurnover
      })

      //--------------------Cash To Cash Cycle Time By Position Key Year----------------
      const filteredCashCycle = filterByDateProduct(cashCycleData, selectedDate, selectedProductCategory)
      const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
      const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'
      setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
      //console.log("setCashCycle",cashCycle);
      const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');


      // console.log('sumCashCycle',sumCashCycle)
      setCashCycleChart({
        CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
        Position_Key_Year: sumCashCycle.Position_Key_Year
      })

      //--------------------Stock to Sales Ratio --------------------
      const filteredSTSR = filterByDateProduct(salesRatioData, selectedDate, selectedProductCategory)
      const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
      const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
      const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
      setSalesRatioCard({ cardValue: persentageSTSR, benchmark: benchMarkSTSR })
      //--------------------Inventory Age --------------------
      const filteredIA = filterByDateProduct(inventoryAgeData, selectedDate, selectedProductCategory)
      const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
      const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
      const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
      setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })

      // -------------------------Despatch Rate------------------------------
      const filteredDR = filterByDateProduct(despatchRateData, selectedDate, selectedProductCategory)
      const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
      setDespatchRate({
        MATKL_Material_Category: labelcategory,
        Despatch_Rate: series
      })


    }
    else {

      console.log('inside else');

      //   ------------Back Order Rate---------------
      // const filteredBOR = filterByDatePlantProduct(backOrderRateData, selectedDate, selectedPlants, selectedProductCategory)
      // const persentageBOR = calculateAveragePercentage(filteredBOR, 'BackOrderRate')
      // const filteredBenchMark = filterBenchMarkData(benchMarkData, 'BackOrderRate')
      // const benchMark = persentageBOR >= filteredBenchMark ? 'high' : 'low'
      // setBackOrderRate({ cardValue: persentageBOR, benchmark: benchMark })

      // //--------------------Inventory Turnover-----------------------
      const filteredIT = filterByDatePlantProduct(inventoryTurnData, selectedDate, selectedPlants, selectedProductCategory)
      const persentageIT = calculateAveragePercentage(filteredIT, 'InventoryTurnover')
      const filteredBenchMarkIT = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMarkIT = persentageIT >= filteredBenchMarkIT ? 'high' : 'low'
      setInventoryTurn({ cardValue: persentageIT, benchmark: benchMarkIT })
      const sumInvTurn = calculateGroupByPercentage(filteredIT, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryTurnChart({
        MATKL_Material_Category: sumInvTurn.MATKL_Material_Category,
        InventoryTurnover: sumInvTurn.InventoryTurnover
      })

      //--------------------Cash To Cash Cycle Time By Position Key Year----------------
      const filteredCashCycle = filterByDatePlantProduct(cashCycleData, selectedDate, selectedPlants, selectedProductCategory)
      // console.log('filteredCashCycle',filteredCashCycle);
      const persentageCashCycle = calculateAverage(filteredCashCycle, 'CashToCashCycleTime')
      const filteredBenchMarkCC = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
      const benchMarkCC = persentageCashCycle >= filteredBenchMarkCC ? 'high' : 'low'
      setCashCycle({ cardValue: persentageCashCycle, benchmark: benchMarkCC })
      const sumCashCycle = calculateGroupByPercentage(filteredCashCycle, 'Position_Key_Year', 'CashToCashCycleTime');
      // console.log('sumCashCycle',sumCashCycle);
      setCashCycleChart({
        CashToCashCycleTime: sumCashCycle.CashToCashCycleTime,
        Position_Key_Year: sumCashCycle.Position_Key_Year
      })

      //--------------------Stock to Sales Ratio --------------------
      const filteredSTSR = filterByDatePlantProduct(salesRatioData, selectedDate, selectedPlants, selectedProductCategory)
      const persentageSTSR = calculateAveragePercentage(filteredSTSR, 'StocktoSalesRatio')
      const filteredBenchMarkSTSR = filterBenchMarkData(benchMarkData, 'StocktoSalesRatio')
      const benchMarkSTSR = persentageSTSR >= filteredBenchMarkSTSR ? 'high' : 'low'
      setSalesRatioCard({ cardValue: persentageSTSR, benchmark: benchMarkSTSR })
      //--------------------Inventory Age --------------------
      const filteredIA = filterByDatePlantProduct(inventoryAgeData, selectedDate, selectedPlants, selectedProductCategory)
      const avarageIA = calculateAverage(filteredIA, 'InventoryAgeInDays')
      const filteredBenchIA = filterBenchMarkData(benchMarkData, 'InventoryAgeInDays_Forecast')
      const benchMarkIA = avarageIA >= filteredBenchIA ? 'high' : 'low'
      setInventoryAgeCard({ cardValue: avarageIA, benchmark: benchMarkIA })


      // -------------------------Despatch Rate------------------------------
      const filteredDR = filterByDatePlantProduct(despatchRateData, selectedDate, selectedPlants, selectedProductCategory)
      const { series, labelcategory } = transformDataForChart(filteredDR, 'MATKL_Material_Category', 'Despatch_Rate', 'Formatted_Date');
      setDespatchRate({
        MATKL_Material_Category: labelcategory,
        Despatch_Rate: series
      })


    }
    flagSet();
  };

  const flagSet = () => {
    if (inventoryTurnChart.InventoryTurnover.length > 0) {
      setInventoryTurnChartLoder(1)
    }
    else {
      setInventoryTurnChartLoder(1)
    }


    if (cashCycleChart.CashToCashCycleTime.length > 0) {
      setCashCycleChartLoder(1)
    }
    else {
      setCashCycleChartLoder(1)
    }

    if (despatchRate.Despatch_Rate.length > 0) {
      setlineChartStatus(1)
    }
    else {
      setlineChartStatus(1)
    }


  }

  return (
    <Box m="20px" sx={{ flexGrow: 1 }}>

      <Grid container spacing={2}>
        <Grid item xs={3} md={3}>
          <Typography
            variant="h4"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 5px" }}
          >Stock Finished Goods</Typography>
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
            <InputLabel id="Plants-select-label">Plant Name</InputLabel>
            <Select
              labelId="plants-select-label"
              id="Plants-select"
              value={selectedPlants}
              label="Plant Name"
              sx={{ minWidth: '250px' }}
              MenuProps={{
                PaperProps: { style: { maxHeight: '250px' } }
              }}
              onChange={(event) => {
                handlePlantChange(event.target.value);
              }}
            >
              {showAllOption && (
                <MenuItem key="all-option" value="All">
                  All
                </MenuItem>
              )}
              {plants.map((Plants, i) => (
                <MenuItem key={i} value={Plants.NAME1}>
                  {Plants.NAME1}
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
        {/* <Grid item xs={3} md={3}>
         <GlobalCard
              title="Back Order Rate"
              subtitle={loading ? 'Loading...' : backOrderRate.cardValue?.toString() ?? '0'}
              tooltipContent="The Back Order Rate KPI measures how many orders cannot be filled at the time a customer places them"
              units={loading ? null : '%'}
              benchmark={loading ? null : backOrderRate.benchmark}
            />
        </Grid> */}
        <Grid item xs={3} md={3}>
          <GlobalCard
            title="Inventory Turnover"
            subtitle={loading ? 'Loading...' : inventoryTurn.cardValue?.toString() ?? 'Loading...'}
            tooltipContent="Check more about Inventory Turnover"
            units={loading ? null : '%'}
            benchmark={loading ? null : inventoryTurn.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
        <Grid item xs={3} md={3}>
          <GlobalCard
            title="Cash to Cash Cycle Time"
            subtitle={loading ? 'Loading...' : cashCycle.cardValue?.toString() ?? 'Loading...'}
            tooltipContent="Check more about Cash Cycle Time"
            units={loading ? null : 'Days'}
            benchmark={loading ? null : cashCycle.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
        <Grid item xs={3} md={3}>
          <GlobalCard
            title="Stock to Sales Ratio"
            subtitle={loading ? 'Loading...' : salesRatioCard.cardValue?.toString() ?? 'Loading...'}
            tooltipContent="A measure of inventory efficiency, indicating the number of days it takes to sell existing stock."
            units={loading ? null : '%'}
            benchmark={loading ? null : salesRatioCard.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
        <Grid item xs={3} md={3}>
          <GlobalCard
            title="Inventory Age"
            subtitle={loading ? 'Loading...' : inventoryAgeCard.cardValue?.toString() ?? 'Loading...'}
            tooltipContent="Aging Inventory KPI requires the storage date of the inventory as well as the aging threshold in hours for the asset"
            units={loading ? null : 'Days'}
            benchmark={loading ? null : inventoryAgeCard.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={6} md={6}>
          {/* <label>Inventory Turnover By Product Catagory</label> */}
          <PieCharts series={inventoryTurnChart.InventoryTurnover}
            labels={inventoryTurnChart.MATKL_Material_Category}
            flag={inventoryTurnChartLoder}
            tilesLables="Inventory Turnover By Product Catagory"
            height="300" />
        </Grid>
        <Grid item xs={6} md={6}>
          {/* <label>Cash To Cash Cycle Time By Year</label> */}
          <DistributedColumnChart
            series={cashCycleChart.CashToCashCycleTime}
            labels={cashCycleChart.Position_Key_Year}
            flag={cashCycleChartLoder}
            tilesLables="Cash To Cash Cycle Time By Year"
            height="300"
            legend='Cash To Cash Cycle Time (Days)'
            format_func={formatDays}
          />
        </Grid>


        <Grid item xs={12} md={12}>
          <LineChart
            series={despatchRate.Despatch_Rate}
            labels={despatchRate.MATKL_Material_Category}
            tilesLables="Day Wise Despatch Trend By Product Category"
            flag={lineChartStatus}
            height='350'
          />
        </Grid>


      </Grid>

      <Grid>
        {tabularData.length > 0 ? (
          <Paper sx={{ width: '100%', marginTop: '20px', borderRadius: '10px' }}>
            <TableContainer sx={{ maxHeight: 440, backgroundColor: "#e6e6e6", borderRadius: '10px' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead style={{
                  borderRadius: "10px", position: 'sticky',
                  top: 0,
                  zIndex: 999, backgroundColor: "#e6e6e6"
                }}  >
                  <TableRow>
                    <TableCell align="center" style={{ width: 170, backgroundColor: "#00000033", borderRightWidth: '1px', borderColor: '#e6e6e6' }} rowSpan={2} colSpan={1}>
                      Product Category
                    </TableCell>
                    <TableCell align="center" style={{ width: 510, backgroundColor: "#00000033", }} colSpan={3}>
                      Inventory Age
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}

                        style={{ minWidth: column.minWidth, backgroundColor: "#00000033" }}
                      >
                        <div style={{ fontWeight: '600' }}>{column.label}</div>

                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>

                  {tabularData.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.category}</TableCell>

                      <TableCell style={{ width: 170 }}>
                        <div className='rowTableCell'>
                          <div className='rowTableCellData'>
                            <div style={{ width: '100px', color: '#DE3163', fontWeight: '600' }}>Amount</div>
                            {"₹" + " " + formatNumberWithCommasTooltip(row[">60"][0].amount)}
                          </div>
                          <div>
                            <div style={{ color: '#0191E0', fontWeight: 600 }}>Quantity</div>
                            {formatNumberWithCommasAndRound(row[">60"][0].quantity)}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell style={{ width: 170 }}>

                        <div className='rowTableCell'>
                          <div className='rowTableCellData'>
                            <div style={{ color: '#DE3163', fontWeight: 600 }}>Amount</div>
                            {"₹" + " " + formatNumberWithCommasTooltip(row["60-90"][0].amount)}
                          </div>
                          <div className='rowTableCellData'>
                            <div style={{ color: '#0191E0', fontWeight: 600 }}>Quantity</div>
                            {formatNumberWithCommasAndRound(row["60-90"][0].quantity)}
                          </div>
                        </div>

                      </TableCell>

                      <TableCell style={{ width: 170 }}>
                        <div className='rowTableCell'>
                          <div className='rowTableCellData'>
                            <div style={{ color: '#DE3163', fontWeight: 600 }}>Amount</div>
                            {"₹" + " " + formatNumberWithCommasTooltip(row["<60"][0].amount)}
                          </div>
                          <div className='rowTableCellData'>
                            <div style={{ color: '#0191E0', fontWeight: 600 }}>Quantity</div>
                            {formatNumberWithCommasAndRound(row["<60"][0].quantity)}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tabularData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        ) :
          (
            <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic', color: '#777', fontWeight: '700' }}>
              <TableContainer sx={{ maxHeight: 440, backgroundColor: "#e6e6e6", borderRadius: '10px' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead style={{
                    borderRadius: "10px", position: 'sticky',
                    top: 0,
                    zIndex: 999, backgroundColor: "#e6e6e6"
                  }}>
                    <TableRow>
                      <TableCell align="center" style={{ width: 170, backgroundColor: "#00000033", borderRightWidth: '1px', borderColor: '#e6e6e6' }} rowSpan={2} colSpan={1}>
                        Product Category
                      </TableCell>
                      <TableCell align="center" style={{ width: 510, backgroundColor: "#00000033", }} colSpan={3}>
                        Inventory Age
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ minWidth: column.minWidth, backgroundColor: "#00000033" }}
                        >
                          <div style={{ fontWeight: '600' }}>{column.label}</div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              <div style={{ fontStyle: 'italic', color: '#777', fontWeight: '700', marginTop: '20' }}>
                Data Not Available For "{selectedPlants}"
              </div>
            </div>
          )
        }

      </Grid>
    </Box>
  );
};

export default StockFinishedGoods;