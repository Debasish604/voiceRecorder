import * as React from 'react';
import { Box, InputLabel, MenuItem, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Grid from '@mui/material/Unstable_Grid2';
import GlobalCard from "../../../components/GlobalCard";
import RadialBarChart from "../../../components/charts/RadialBar";
import { useEffect, useState } from 'react';
import { apiService } from '../../../service/api-service';
import SimpleBackdrop from "../../../scenes/global/Loader";
import DonutCharts from "../../../components/charts/DonutChart";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import '../../../style/GlobalStyle.css'


import {
  calculateGroupByPercentage,
  calculateGroupByAverage,
  filterByDateAndClient,
  calculateAveragePercentage,
  filterBenchMarkData,
  filterByDateClientProduct,
  filterByDate,
  filterByDateProduct,
  filterByDateClientPlant,
  filterByDateAndClientAndPlant,
  filterByDateClientPlantProduct,
  filterByDateAndplant,
  filterByDatePlantProduct,
  filterByDateAndPlantAndProduct,
  calculateGroupByAverageDateWish,
  filterByDateClientPlantForChart,
  transformDataForChart
} from "../../../utils/GlobalFilters";
//----------------------For Date filter -------------------------------
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useLocation } from 'react-router-dom';
import ProductCategoryRaw from "../../../components/dropdown/ProductCategoryRaw";
import LineChart from '../../../components/charts/Linechart';


const columns = [
  { id: '>90 Days', label: '>90 Days', minWidth: 170 },
  { id: '60-90 Days', label: '60-90 Days', minWidth: 170 },
  { id: '<60 Days', label: '<60 Days', minWidth: 170 },
];



const Stockrawmaterials = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  //----------------------For Date filter -------------------------------
  const [monthYear, setmonthYear] = useState('Select month and year')
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState('');
  //----------------------For Client filter -------------------------------
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  // ----------------for products---------------
  const [products, setproducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');


  const [showAllOption, setShowAllOption] = useState(true);
  //-------------------- Bench mark----------------
  const [benchMarkData, setBenchMarkData] = useState([])
  //--------------------InventoryTurnover----------------
  const [inventoryTurnData, setInventoryTurnData] = useState([])
  const [inventoryCard, setInventoryCard] = useState({ cardValue: null, benchmark: null })

  const [inventoryProduct, setInventoryProduct] = useState({ MATKL_Material_Category: [], InventoryTurnover: [] })

  //------------Stock out Rate---------------
  const [stockoutRateData, setStockoutRateData] = useState([])
  const [stockoutRateCard, setStockoutRateCard] = useState({ cardValue: null, benchmark: null })
  const [stockoutRate, setStockoutRate] = useState({ MATKL_Material_Category: [], Stockout_Rate: [] })

  // -----------Plants---------
  const [plants, setPlants] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState('');

  const [selectedtable, setSelectedtable] = useState('');


  const [rawMaterialTotalCost, setRawmaterialTotalCost] = useState([])

  const [donutChartStatus, setdonutChartStatus] = useState(0)
  const [pieChartStatus, setpieChartStatus] = useState(0)
  const [lineChartStatus, setlineChartStatus] = useState(0)


  // *****************consumption_Rate_Forecast***************
  const [consumptionRateData, setConsumptionRateData] = useState([])
  const [ConsumptionRate, setConsumptionRate] = useState({ MATKL_Material_Category: [], Consumption_Rate: [] })

  const flagSet = () => {
    if (inventoryProduct.InventoryTurnover.length > 0) {
      setpieChartStatus(1)
    }
    else {
      setpieChartStatus(1)
    }

    if (stockoutRate.length > 0) {
      setdonutChartStatus(1)
    }
    else {
      setdonutChartStatus(1)
    }

    if (ConsumptionRate.Consumption_Rate.length > 0) {
      setlineChartStatus(1)
    }
    else {
      setlineChartStatus(1)
    }


  }
  const flagReset = () => {
    setdonutChartStatus(0)
    setpieChartStatus(0)
    setlineChartStatus(0)
  }


  const Raw_Materials_Total_Cost_Amount_Wise_Tabular_Data = async (selectedtable) => {
    console.log('selectedtable is in api', selectedtable);
    try {
      const requestData = {
        plant_Name: selectedtable,
      };

      const response = await apiService.Raw_Materials_Total_Cost_Amount_Wise_Tabular_Data(requestData);
      console.log("Raw_Materials_Total_Cost_Amount_Wise_Tabular_Data Response:", response);
      if (response) {
        setRawmaterialTotalCost(modifyData(response.Raw_Materials_Total_Cost_Amount_Wise_Tabular_Data));
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      // Handle the error as needed
    }
  };


  const modifyData = (inputData) => {
    const result = [];

    for (const category in inputData) {
      const periods = inputData[category];

      const modifiedCategory = {
        category: category,
        ">60": getModifiedEntries(periods[">60"]),
        "60-90": getModifiedEntries(periods["60-90"]),
        "<60": getModifiedEntries(periods["<60"]),
      };

      result.push(modifiedCategory);
    }

    return result;
  };

  const getModifiedEntries = (entries) => {
    return Array.isArray(entries)
      ? [
        {
          amount: entries.reduce((sum, entry) => sum + entry.Total_Cost, 0).toString(),
          quantity: entries.reduce((sum, entry) => sum + entry.Total_Quantity, 0).toString(),
        },
      ]
      : [
        {
          amount: entries && entries.Total_Cost ? entries.Total_Cost.toString() : 0,
          quantity: entries && entries.Total_Quantity ? entries.Total_Quantity.toString() : 0,
        },
      ];
  };

  const formatNumberWithCommasAndRound = (value, decimalPlaces) => {
    const roundedValue = Number(value).toFixed(decimalPlaces);
    return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatNumberWithCommasTooltip = (value) => {
    const formattedNumber = parseFloat(value).toFixed(2);
    return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }



  //--------------------Client Filter----------------
  const fetchClients = async () => {
    try {
      const response = await apiService.filterdropdown();
      const productsData = response.Product_Category_raw || [];
      setproducts(productsData);
      // setSelectedProduct(productsData[0].MATKL_Material_Category);
      setSelectedProduct("All");
      const clientData = response.client || [];
      setClients(clientData);

      const plantsData = response.plants || [];
      setPlants(plantsData);

      const supplierFromUrl = searchParams.get('supplier') || '';
      if (supplierFromUrl) {
        setSelectedClient(supplierFromUrl);
        setSelectedPlants(plantsData[0].NAME1);
      }
      else
        if (clientData.length > 0 && plantsData.length > 0) {
          setSelectedClient(clientData[0].MTEXT_ClientName);
          setSelectedPlants(plantsData[0].NAME1);
        }
      //   else if (plantsData.length > 0) {
      //     setSelectedPlants(plantsData[0].NAME1);
      // }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchData = async () => {
    try {
      // setLoading(true);
      //--------------------InventoryTurnover----------------
      const inventoryResponse = await apiService.InventoryTurnover();
      setInventoryTurnData(inventoryResponse.InventoryTurnover_Forecast)
      if (inventoryResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData) {
        const filteredQS = filterByDateClientPlant(inventoryResponse.InventoryTurnover_Forecast, selectedDate, selectedClient, selectedPlants)
        // console.log('all selected data',selectedDate, selectedClient, selectedProduct);
        // console.log('filteredQS',filteredQS);
        const persentageQS = calculateAveragePercentage(filteredQS, 'InventoryTurnover')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
        const benchMark = persentageQS >= filteredBenchMark ? 'high' : 'low'
        setInventoryCard({ cardValue: persentageQS, benchmark: benchMark })

        const inventoryTurnResult = calculateGroupByAverage(filteredQS, 'MATKL_Material_Category', 'InventoryTurnover');
        setInventoryProduct({
          MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
          InventoryTurnover: inventoryTurnResult.InventoryTurnover
        })
      }

      //------------Storck out Rate---------------
      const stockOutRateResponse = await apiService.Stockout_Rate();
      setStockoutRateData(stockOutRateResponse.Stockout_Rate_Forecast)
      if (stockOutRateResponse.status === 'success' && selectedClient !== '' && selectedDate && benchMarkData) {
        const filteredQS = filterByDateClientPlant(stockOutRateResponse.Stockout_Rate_Forecast, selectedDate, selectedClient, selectedPlants)
        console.log('filteredQS', filteredQS)
        const persentageQS = calculateAveragePercentage(filteredQS, 'Stockout_Rate')
        console.log('persentageQS', persentageQS);
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
        const benchMark = persentageQS >= filteredBenchMark ? 'high' : 'low'
        // console.log('test',persentageQS,benchMark);
        setStockoutRateCard({ cardValue: persentageQS, benchmark: benchMark })
        setStockoutRate(persentageQS)
        // console.log('setStockoutRate',stockoutRate);
      }

      // -------------------------Consumation Rate------------------------------
      const consumptionRateResponse = await apiService.Consumption_Rate();
      setConsumptionRateData(consumptionRateResponse.Consumption_Rate_Forecast)
      if (consumptionRateResponse.status === 'success' && selectedClient !== '' && selectedDate) {
        const filteredCRS = filterByDateClientPlant(consumptionRateResponse.Consumption_Rate_Forecast, selectedDate, selectedClient, selectedPlants)
        // console.log('filteredCRS subha', filteredCRS);
        // const consumptionRateResult = calculateGroupByAverage(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate');

        const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
        console.log('series subha', series);
        console.log('labelcategory subha', labelcategory);
        setConsumptionRate({
          MATKL_Material_Category: labelcategory,
          Consumption_Rate: series
        })
      }


      // -----------------------tablel data----------------------------------
      if (selectedPlants !== '') {
        console.log('in fetch data function ', selectedPlants);
        Raw_Materials_Total_Cost_Amount_Wise_Tabular_Data(selectedPlants)
      }




      // flagSet();

    } catch (error) {
      console.error('Error fetching inventory turnover:', error.message);
    }
    finally {
      // setLoading(false);
    }
  };

  const fetchBenchMark = async () => {
    //--------------------Bench Mark -----------------------
    const benchMarkResponse = await apiService.benchmarkShow();
    if (benchMarkResponse.status === "Success") {
      setBenchMarkData(benchMarkResponse.client)
    }
  }

  useEffect(() => {
    const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
    setSelectedDate(formattedDataDate);
    fetchBenchMark();
  }, []);

  useEffect(() => {
    fetchData();
  }, [clients]);


  useEffect(() => {
    fetchClients();
    Raw_Materials_Total_Cost_Amount_Wise_Tabular_Data(selectedtable)
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value, 10);
    setPage(0);
  };


  //--------------------Date Filter----------------------------------------------------
  const handleDateChange = async (newValue) => {
    flagReset()
    try {
      console.log(' inside handleDateChange');

      const formattedDataDate = dayjs(newValue).format('MMM YYYY');
      setmonthYear('Selected month and year')
      setSelectedDate(formattedDataDate);
      console.log('inside handleClientChange ');

      if (selectedClient === 'All' && selectedProduct === 'All' && selectedPlants === 'All' && selectedDate) {

        console.log('date chnage if condition');

        // ------------- Inventory Turnover -------------------
        const filteredSRS = filterByDate(inventoryTurnData, formattedDataDate)
        const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
        const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
        setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

        const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
        setInventoryProduct({
          MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
          InventoryTurnover: inventoryTurnResult.InventoryTurnover
        })


        //------------Storck out Rate---------------
        const filteredSOR = filterByDate(stockoutRateData, formattedDataDate)
        const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
        const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
        const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
        setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
        setStockoutRate(persentageSOR)

        // -------------------------Consumation Rate------------------------------
        const filteredCRS = filterByDate(consumptionRateData, formattedDataDate)
        const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
        setConsumptionRate({
          MATKL_Material_Category: labelcategory,
          Consumption_Rate: series
        })

      }
      else if (selectedProduct === 'All' && selectedDate && selectedClient !== 'All' && selectedPlants !== 'All') {
        console.log('date chnage else if 1 condition');

        // ------------- Inventory Turnover -------------------
        const filteredSRS = filterByDateAndClientAndPlant(inventoryTurnData, formattedDataDate, selectedClient, selectedPlants)
        const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
        const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
        setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

        const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
        setInventoryProduct({
          MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
          InventoryTurnover: inventoryTurnResult.InventoryTurnover
        })


        //------------Storck out Rate---------------
        const filteredSOR = filterByDateAndClientAndPlant(stockoutRateData, formattedDataDate, selectedClient, selectedPlants)
        const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
        const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
        const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
        setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
        setStockoutRate(persentageSOR)

        // -------------------------Consumation Rate------------------------------
        const filteredCRS = filterByDateAndClientAndPlant(consumptionRateData, formattedDataDate, selectedClient, selectedPlants)
        const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
        setConsumptionRate({
          MATKL_Material_Category: labelcategory,
          Consumption_Rate: series
        })


      }
      else if (selectedProduct !== 'All' && selectedDate && selectedClient === 'All' && selectedPlants === 'All') {
        console.log('handleDateChange else if2  ');

        // ------------- Inventory Turnover -------------------
        const filteredSRS = filterByDateProduct(inventoryTurnData, formattedDataDate, selectedProduct)
        const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
        const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'

        setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })
        const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
        setInventoryProduct({
          MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
          InventoryTurnover: inventoryTurnResult.InventoryTurnover
        })


        //------------Storck out Rate---------------
        const filteredSOR = filterByDateProduct(stockoutRateData, formattedDataDate, selectedProduct)
        const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
        const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
        const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
        setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
        setStockoutRate(persentageSOR)

        // -------------------------Consumation Rate------------------------------
        const filteredCRS = filterByDateProduct(consumptionRateData, formattedDataDate, selectedProduct)
        const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
        setConsumptionRate({
          MATKL_Material_Category: labelcategory,
          Consumption_Rate: series
        })



      }

      else {
        console.log('handleDateChange else  ');

        // ------------- Inventory Turnover -------------------
        // console.log('inventoryTurnData, formattedDataDate, selectedDate,selectedClient, selectedPlants, selectedProduct',
        // inventoryTurnData, formattedDataDate, selectedDate,selectedClient, selectedPlants, selectedProduct);
        // const filteredSRS2 = filterByDateClientPlantProduct(inventoryTurnData, selectedDate, selectedClient, selectedPlants, selectedProduct)
        const filteredSRS = filterByDateClientPlantProduct(inventoryTurnData, formattedDataDate, selectedClient, selectedPlants, selectedProduct)
        // console.log('filteredSRS s',filteredSRS);
        const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
        const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
        const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
        setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

        const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
        setInventoryProduct({
          MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
          InventoryTurnover: inventoryTurnResult.InventoryTurnover
        })


        //------------Storck out Rate---------------
        const filteredSOR = filterByDateClientPlantProduct(stockoutRateData, formattedDataDate, selectedClient, selectedPlants, selectedProduct)
        const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
        const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
        const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
        setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
        setStockoutRate(persentageSOR)

        // -------------------------Consumation Rate------------------------------
        const filteredCRS = filterByDateClientPlantProduct(consumptionRateData, formattedDataDate, selectedClient, selectedPlants, selectedProduct)
        console.log('filteredCRS', filteredCRS);
        const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');

        // console.log('series',series);
        // console.log('labelcategory',labelcategory);
        setConsumptionRate({
          MATKL_Material_Category: labelcategory,
          Consumption_Rate: series
        })

      }

      flagSet()


    } catch (error) {
      console.error('Error fetching data for the selected date:', error.message);
    }
  };

  //--------------------Client Filter------------------------------------------------------
  const handleClientChange = (event) => {
    flagReset()
    const selectedValue = event;
    setSelectedClient(event);
    console.log('inside handleClientChange value', selectedValue);

    if (selectedValue === 'All' && selectedProduct === 'All' && selectedPlants === 'All' && selectedDate) {
      console.log('handleClientChange if');

      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDate(inventoryTurnData, selectedDate)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })

      //------------Storck out Rate---------------
      const filteredSOR = filterByDate(stockoutRateData, selectedDate)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDate(consumptionRateData, selectedDate)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }

    else if (selectedProduct === 'All' && selectedDate && selectedValue !== 'All' && selectedPlants !== 'All') {
      console.log('handleClientChange else if 1');
      const filteredSRS = filterByDateAndClientAndPlant(inventoryTurnData, selectedDate, selectedValue, selectedPlants)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })


      //------------Storck out Rate---------------
      const filteredSOR = filterByDateAndClientAndPlant(stockoutRateData, selectedDate, selectedValue, selectedPlants)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateAndClientAndPlant(consumptionRateData, selectedDate, selectedValue, selectedPlants)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }

    else if (selectedProduct !== 'All' && selectedDate && selectedValue === 'All' && selectedPlants === 'All') {
      console.log('handleClientChange else  if 2');
      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDateProduct(inventoryTurnData, selectedDate, selectedProduct)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateProduct(stockoutRateData, selectedDate, selectedProduct)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateProduct(consumptionRateData, selectedDate, selectedProduct)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })





    }

    else if (selectedProduct === 'All' && selectedDate && selectedValue === 'All' && selectedPlants !== 'All') {
      console.log('handleClientChange elseif 3 ');

      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDateAndplant(inventoryTurnData, selectedDate, selectedPlants)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateAndplant(stockoutRateData, selectedDate, selectedPlants)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateAndplant(consumptionRateData, selectedDate, selectedPlants)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }

    else if (selectedProduct === 'All' && selectedDate && selectedValue !== 'All' && selectedPlants === 'All') {
      console.log('handleClientChange elseif 4 ');

      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDateAndClient(inventoryTurnData, selectedDate, selectedClient)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateAndClient(stockoutRateData, selectedDate, selectedClient)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateAndClient(consumptionRateData, selectedDate, selectedClient)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }

    else if (selectedProduct !== 'All' && selectedDate && selectedValue === 'All' && selectedPlants !== 'All') {
      console.log('handleClientChange else if 5');
      const filteredSRS = filterByDateAndPlantAndProduct(inventoryTurnData, selectedDate, selectedPlants, selectedProduct)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })


      //------------Storck out Rate---------------
      const filteredSOR = filterByDateAndPlantAndProduct(stockoutRateData, selectedDate, selectedPlants, selectedProduct)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateAndPlantAndProduct(consumptionRateData, selectedDate, selectedPlants, selectedProduct)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })
    }


    else {
      console.log('handleClientChange else');
      // ------------- Inventory Turnover -------------------
      // console.log('inventoryTurnData, selectedDate, supplier, selectedPlants, selectedProduct',inventoryTurnData, selectedDate, selectedValue, selectedPlants, selectedProduct);
      const filteredSRS = filterByDateClientPlantProduct(inventoryTurnData, selectedDate, selectedValue, selectedPlants, selectedProduct)
      // console.log('filteredSRS',filteredSRS);
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      // console.log('stockoutRateData, selectedDate, supplier, selectedPlants, selectedProduct', stockoutRateData, selectedDate, selectedValue, selectedPlants, selectedProduct);
      const filteredSOR = filterByDateClientPlantProduct(stockoutRateData, selectedDate, selectedValue, selectedPlants, selectedProduct)
      // console.log('filteredSOR', filteredSOR);
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateClientPlantProduct(consumptionRateData, selectedDate, selectedValue, selectedPlants, selectedProduct)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })



    }

    flagSet()
  };


  // --------------------Plant filter------------------

  const handlePlantChange = (event) => {
    flagReset()
    const selectedValue = event
    setSelectedPlants(event);
    console.log('inside handel plant change');

    const selectedtable = event === 'All' ? '' : event;
    console.log('selectedtable in handel plat change', selectedtable);
    setSelectedtable(event);


    // Call the API with the dynamically chosen plant name
    Raw_Materials_Total_Cost_Amount_Wise_Tabular_Data(selectedtable);

    if (selectedValue === 'All' && selectedProduct === 'All' && selectedClient === 'All' && selectedDate) {
      console.log('handlePlantChange if ');
      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDate(inventoryTurnData, selectedDate)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })


      //------------Storck out Rate---------------
      const filteredSOR = filterByDate(stockoutRateData, selectedDate)
      console.log('filteredSOR', filteredSOR);
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      console.log('persentageSOR', persentageSOR)
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDate(consumptionRateData, selectedDate)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }

    else if (selectedProduct === 'All' && selectedDate && selectedValue !== 'All' && selectedClient !== 'All') {
      console.log('handlePlantChange else if 1');
      // console.log('inventoryTurnData, selectedDate, selectedValue, selectedPlants', inventoryTurnData, selectedDate, selectedClient, selectedValue);
      const filteredSRS = filterByDateAndClientAndPlant(inventoryTurnData, selectedDate, selectedClient, selectedValue)
      // console.log('filteredSRS', filteredSRS);
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })


      //------------Storck out Rate---------------
      const filteredSOR = filterByDateAndClientAndPlant(stockoutRateData, selectedDate, selectedClient, selectedValue)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateAndClientAndPlant(consumptionRateData, selectedDate, selectedClient, selectedValue)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })

    }

    else if (selectedProduct !== 'All' && selectedDate && selectedValue === 'All' && selectedClient === 'All') {
      console.log('handlePlantChange elseif2 ');

      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDateProduct(inventoryTurnData, selectedDate, selectedProduct)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateProduct(stockoutRateData, selectedDate, selectedProduct)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateProduct(consumptionRateData, selectedDate, selectedProduct)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }

    else if (selectedProduct === 'All' && selectedDate && selectedValue === 'All' && selectedClient !== 'All') {
      console.log('handlePlantChange elseif 3 ');

      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDateAndClient(inventoryTurnData, selectedDate, selectedClient)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateAndClient(stockoutRateData, selectedDate, selectedClient)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateAndClient(consumptionRateData, selectedDate, selectedClient)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })

    }

    else if (selectedProduct === 'All' && selectedDate && selectedValue !== 'All' && selectedClient === 'All') {
      console.log('handlePlantChange elseif 4');

      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDateAndplant(inventoryTurnData, selectedDate, selectedValue)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateAndplant(stockoutRateData, selectedDate, selectedValue)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateAndplant(consumptionRateData, selectedDate, selectedValue)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }

    else if (selectedProduct !== 'All' && selectedDate && selectedValue === 'All' && selectedClient !== 'All') {
      console.log('handlePlantChange else if 5');
      // console.log('inventoryTurnData, selectedDate, selectedValue, selectedPlants', inventoryTurnData, selectedDate, selectedClient, selectedValue);
      const filteredSRS = filterByDateClientProduct(inventoryTurnData, selectedDate, selectedClient, selectedProduct)
      // console.log('filteredSRS', filteredSRS);
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })


      //------------Storck out Rate---------------
      const filteredSOR = filterByDateClientProduct(stockoutRateData, selectedDate, selectedClient, selectedProduct)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateClientProduct(consumptionRateData, selectedDate, selectedClient, selectedProduct)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })

    }


    else {
      console.log('handlePlantChange else ');

      // ------------- Inventory Turnover -------------------
      // console.log('inventoryTurnData, selectedDate, selectedClient, selectedValue, selectedProduct',inventoryTurnData, selectedDate, selectedClient, selectedValue, selectedProduct);
      const filteredSRS = filterByDateClientPlantProduct(inventoryTurnData, selectedDate, selectedClient, selectedValue, selectedProduct)

      // console.log('filteredSRS',filteredSRS);
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateClientPlantProduct(stockoutRateData, selectedDate, selectedClient, selectedValue, selectedProduct)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateClientPlantProduct(consumptionRateData, selectedDate, selectedClient, selectedValue, selectedProduct)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })



    }

    flagSet()

  };

  //--------------------Product Filter-------------------------------------------------------
  const productChange = async (selectedValue) => {
    flagReset()
    setSelectedProduct(selectedValue)
    const selectedProductCategory = selectedValue
    console.log('inside the product change');
    if (selectedClient === 'All' && selectedProductCategory === 'All' && selectedPlants === 'All' && selectedDate) {
      console.log('productChange if ');
      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDate(inventoryTurnData, selectedDate)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })


      //------------Storck out Rate---------------
      const filteredSOR = filterByDate(stockoutRateData, selectedDate)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })
      setStockoutRate(persentageSOR)

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDate(consumptionRateData, selectedDate)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }

    else if (selectedProductCategory === 'All' && selectedDate && selectedClient !== 'All' && selectedPlants !== 'All') {
      console.log('product change else if 1');
      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDateAndClientAndPlant(inventoryTurnData, selectedDate, selectedClient, selectedPlants)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateAndClientAndPlant(stockoutRateData, selectedDate, selectedClient, selectedPlants)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateAndClientAndPlant(consumptionRateData, selectedDate, selectedClient, selectedPlants)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }
    else if (selectedProductCategory !== 'All' && selectedDate && selectedClient === 'All' && selectedPlants === 'All') {
      console.log('product change else if 2');

      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDateProduct(inventoryTurnData, selectedDate, selectedProductCategory)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateProduct(stockoutRateData, selectedDate, selectedProductCategory)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateProduct(consumptionRateData, selectedDate, selectedProductCategory)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }

    else if (selectedProductCategory !== 'All' && selectedDate && selectedClient !== 'All' && selectedPlants === 'All') {
      console.log('product change else if 3');

      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDateClientProduct(inventoryTurnData, selectedDate, selectedClient, selectedProductCategory)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateClientProduct(stockoutRateData, selectedDate, selectedClient, selectedProductCategory)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateClientProduct(consumptionRateData, selectedDate, selectedClient, selectedProductCategory)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }

    else if (selectedProductCategory !== 'All' && selectedDate && selectedClient === 'All' && selectedPlants !== 'All') {
      console.log('product change else if 3');

      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDatePlantProduct(inventoryTurnData, selectedDate, selectedPlants, selectedProductCategory)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDatePlantProduct(stockoutRateData, selectedDate, selectedPlants, selectedProductCategory)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDatePlantProduct(consumptionRateData, selectedDate, selectedPlants, selectedProductCategory)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }

    else if (selectedProductCategory === 'All' && selectedDate && selectedClient !== 'All' && selectedPlants === 'All') {
      console.log('product change else if 5');
      // ------------- Inventory Turnover -------------------
      const filteredSRS = filterByDateAndClient(inventoryTurnData, selectedDate, selectedClient)
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateAndClient(stockoutRateData, selectedDate, selectedClient)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateAndClient(consumptionRateData, selectedDate, selectedClient)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })


    }


    else {
      console.log('product change else');
      // ------------- Inventory Turnover -------------------
      // console.log('inventoryTurnData, selectedDate, selectedClient, selectedPlants, selectedProductCategory',inventoryTurnData, selectedDate, selectedClient, selectedPlants, selectedProductCategory);
      const filteredSRS = filterByDateClientPlantProduct(inventoryTurnData, selectedDate, selectedClient, selectedPlants, selectedProductCategory)
      // console.log('filteredSRS',filteredSRS);
      const persentageSRS = calculateAveragePercentage(filteredSRS, 'InventoryTurnover')
      const filteredBenchMark = filterBenchMarkData(benchMarkData, 'InventoryTurnover')
      const benchMark = persentageSRS >= filteredBenchMark ? 'high' : 'low'
      setInventoryCard({ cardValue: persentageSRS, benchmark: benchMark })

      const inventoryTurnResult = calculateGroupByPercentage(filteredSRS, 'MATKL_Material_Category', 'InventoryTurnover');
      setInventoryProduct({
        MATKL_Material_Category: inventoryTurnResult.MATKL_Material_Category,
        InventoryTurnover: inventoryTurnResult.InventoryTurnover
      })



      //------------Storck out Rate---------------
      const filteredSOR = filterByDateClientPlantProduct(stockoutRateData, selectedDate, selectedClient, selectedPlants, selectedProductCategory)
      const persentageSOR = calculateAveragePercentage(filteredSOR, 'Stockout_Rate')
      const filteredBenchMarkSOR = filterBenchMarkData(benchMarkData, 'Stockout_Rate')
      const benchMarkSOR = persentageSOR >= filteredBenchMarkSOR ? 'high' : 'low'
      setStockoutRateCard({ cardValue: persentageSOR, benchmark: benchMarkSOR })

      // -------------------------Consumation Rate------------------------------
      const filteredCRS = filterByDateClientPlantProduct(consumptionRateData, selectedDate, selectedClient, selectedPlants, selectedProductCategory)
      const { series, labelcategory } = transformDataForChart(filteredCRS, 'MATKL_Material_Category', 'Consumption_Rate', 'Formatted_Date');
      setConsumptionRate({
        MATKL_Material_Category: labelcategory,
        Consumption_Rate: series
      })
    }

    flagSet()

  };





  return (
    <Box m="20px">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Typography
            variant="h3"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 5px" }}
          >Stock & Raw Materials</Typography>
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
          <FormControl fullWidth>
            <InputLabel id="client-select-label">Plant Name</InputLabel>
            <Select
              labelId="plants-select-label"
              id="plants-select"
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
              {plants.map((plant, i) => (
                <MenuItem key={i} value={plant.NAME1}>
                  {plant.NAME1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3} md={3}>
          {/* <ProductCategoryRaw product_change={productChange} /> */}
          <FormControl fullWidth>
            <InputLabel id="client-select-label">Raw Products Category</InputLabel>
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
      <Grid container spacing={2}>
        <Grid xs={3} md={3}>
          <GlobalCard
            title="Inventory Turnover"
            subtitle={loading ? 'Loading...' : inventoryCard.cardValue?.toString() ?? 'Loading...'}
            tooltipContent="How many times inventory is sold and replaced within a period."
            units={loading ? null : '%'}
            benchmark={loading ? null : inventoryCard.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
        <Grid xs={3} md={3}>
          <GlobalCard
            title="Stockout Rate"
            subtitle={loading ? 'Loading...' : stockoutRateCard.cardValue?.toString() ?? 'Loading...'}
            tooltipContent="The percentage of time when a product is out of stock and unavailable for customers."
            units={loading ? null : '%'}
            benchmark={loading ? null : stockoutRateCard.benchmark}
            style={{ minHeight: '100px', maxHeight: '150px' }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={6} md={6}>

          <DonutCharts
            series={inventoryProduct.InventoryTurnover}
            labels={inventoryProduct.MATKL_Material_Category}
            tilesLables="Inventory Turnover By Product Category"
            flag={pieChartStatus}
            height='350'
          />
        </Grid>
        <Grid xs={6} >
          <RadialBarChart series_data={stockoutRate} height="420" tilesLables="Stockout Rate and Target Stock Rate Value" flag={donutChartStatus} />
        </Grid>

        <Grid xs={12} >
          <LineChart
            series={ConsumptionRate.Consumption_Rate}
            labels={ConsumptionRate.MATKL_Material_Category}
            tilesLables=" Day Wise Consumption Trend By Product Category"
            flag={lineChartStatus}
            height='350'
          />
        </Grid>




      </Grid>

      <Grid>
        {rawMaterialTotalCost.length > 0 ? (
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
                      Raw Product Category
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

                  {rawMaterialTotalCost.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row, index) => (
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
              count={rawMaterialTotalCost.length}
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
                        Raw Product Category
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
              <div style={{ fontStyle: 'italic', color: '#777', fontWeight: '700',marginTop:'20' }}>
                Data Not Available For "{selectedPlants}"
              </div>
            </div>
          )
        }
      </Grid>

    </Box>
  );
};

export default Stockrawmaterials;
