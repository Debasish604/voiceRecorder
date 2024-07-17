import { Box, useTheme, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../../../theme";
import GlobalCard from "../../../components/GlobalCard";
import BarCharts from "../../../components/charts/Barchart";
import { useEffect, useState } from "react";
import { apiService } from "../../../service/api-service";
import SimpleBackdrop from "../../../scenes/global/Loader";
import DistributedColumnChart from "../../../components/charts/DistributedColumnChart";
import {
    calculateAveragePercentage,
    calculateGroupByAverage,
    formatRuppes,
    formatRuppesTooltip,
    filterBenchMarkData,
    filterByDate,
    filterByDatePlantProduct,
    filterByDatePlant,
    filterByDateProduct


} from "../../../utils/GlobalFilters";
// import StackedColumnChart from "../../../components/charts/StackedColumnChart";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//------------Date picker------------------
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import PieCharts from "../../../components/charts/PieCharts";
import { useLocation } from 'react-router-dom';


const Production = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('')
    const [plants, setPlants] = useState([]);
    const [products, setproducts] = useState([]);

    const [selectedPlants, setSelectedPlants] = useState('');
    const [showAllOption, setShowAllOption] = useState(true);

    //-------------------- Bench mark----------------
    const [benchMarkData, setBenchMarkData] = useState([])
    //----------------------For Date filter -------------------------------
    const [selectedDate, setSelectedDate] = useState(null);
    const [monthYear, setmonthYear] = useState('Selected month and year')
    const currentDate = new Date();

    // //-------------------Order Fulfilment Accuracy--------------------- dont remove
    // const [OrderFulfillmentAccuracyData, setOrderFulfillmentAccuracyData] = useState([])
    // const [OrderFulfillmentAccuracyCard, setOrderFulfillmentAccuracyCard] = useState({ cardValue: null, benchmark: null })

    //-----Production plan variance----//
    const [ProductionPlanVarianceData, setProductionPlanVarianceData] = useState([])
    const [ProductionPlanVarianceCard, setProductionPlanVarianceCard] = useState({ cardValue: null, benchmark: null })

    //--------------------ProductionCostperUnit----------------
    const [productionCostUnitData, setProductionCostUnitData] = useState([])
    const [prodUnitChart, setProdUnitChart] = useState({ series: [], labels: [] })

    //-----MatchingRateBetweenInvoicesAndReceiptsForecast------
    const [matchingRateData, setMatchingRateData] = useState([])
    const [matchingRateChart, setmatchingRatechart] = useState({ product: [], perf_score: [] })
    const [matchingRateChartLoder, setmatchingRatechartLoder] = useState(0)
    const [prodUnitChartLoder, setProdUnitChartLodr] = useState(0)

    //---------ProductCategoryWiseSalesForecast---------
    // const [productCategoryWiseSalesData, setProductCategoryWiseSalesData] = useState([])
    // const [productCategoryWiseSales, setProductCategoryWiseSales] = useState({ MATKL_Material_Category: [], ProductCategoryWiseSales: [] })

    //---------capacityUtilization---------
    const [capacityUtilizationData, setCapacityUtilizationData] = useState([])
    const [capacityUtilizationCrad, setCapacityUtilizationCard] = useState({ cardValue: null, benchmark: null })

    //---------UnplannedDowntime---------
    const [yieldData, setYieldData] = useState([])
    const [yieldCard, setYieldCard] = useState({ cardValue: null, benchmark: null })





    const fetchPlants = async () => {
        try {
            const response = await apiService.filterdropdown();
            const productsData = response.Product_Category || [];
            setproducts(productsData);
            setSelectedProduct("All");

            const plantsData = response.plants || [];
            setPlants(plantsData);

            const plantFromUrl = searchParams.get('plant') || '';
            if (plantFromUrl) {
                setSelectedPlants(plantFromUrl);
            }
            else if (plantsData.length > 0) {
                setSelectedPlants(plantsData[0].NAME1);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };


    const clearAllstatus = () => {
        setmatchingRatechartLoder(0)
        setProdUnitChartLodr(0)
    }







    const flagSet = () => {
        console.log('matchingRateChart', matchingRateChart);
        if (matchingRateChart.product.length > 0) {
            setmatchingRatechartLoder(1)
        }
        else {
            setmatchingRatechartLoder(1)
        }
        if (prodUnitChart.series.length > 0) {
            setProdUnitChartLodr(1)
        }
        else {
            setProdUnitChartLodr(1)
        }
    }



    const fetchData = async () => {

        try {
            // setLoading(true);
            //--------------------Order Fulfilment Accuracy-------------------------------
            // dont remove commented code
            // const OrderFulfillmentAccuracyResponce = await apiService.OrderFulfillmentAccuracyForecast();
            // setOrderFulfillmentAccuracyData(OrderFulfillmentAccuracyResponce.Order_Fulfillment_Accuracy_Forecast)
            // if (OrderFulfillmentAccuracyResponce.status === 'success' && selectedPlants !== '' && selectedDate && benchMarkData) {
            //     const filteredOFA = filterByDatePlant(OrderFulfillmentAccuracyResponce.Order_Fulfillment_Accuracy_Forecast, selectedDate, selectedPlants)
            //     const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
            //     const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
            //     // console.log('filteredBenchMark order fullfillment',filteredBenchMark)
            //     const benchMark = persentageOFA >= filteredBenchMark ? 'high' : 'low'
            //     setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMark })
            // }
            //---------------------Production plan variance--------------
            const ProductionPlanVarianceResponce = await apiService.ProductionPlanVariance();
            setProductionPlanVarianceData(ProductionPlanVarianceResponce.Production_PlanVariance_Forecast)
            // console.log('benchmark for production plan',benchMarkData);
            if (ProductionPlanVarianceResponce.status === 'success' && selectedPlants !== '' && selectedDate && benchMarkData) {

                const filteredPPV = filterByDatePlant(ProductionPlanVarianceResponce.Production_PlanVariance_Forecast, selectedDate, selectedPlants)
                const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
                // console.log('filteredPPV',persentagePPV)
                const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
                // console.log('benchMarkPPV Production plan',benchMarkPPV)
                const benchMar = persentagePPV >= benchMarkPPV ? 'high' : 'low'
                setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMar })

            }

            //---------CapacityUtilization---------------------
            const CapacityUtilizationResponse = await apiService.CapacityUtilization();
            setCapacityUtilizationData(CapacityUtilizationResponse.CapacityUtilization_Forecast)
            if (CapacityUtilizationResponse.status === 'success' && selectedPlants !== '' && selectedDate && benchMarkData) {
                const filteredCU = filterByDatePlant(CapacityUtilizationResponse.CapacityUtilization_Forecast, selectedDate, selectedPlants)
                const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
                const filteredBenchMark = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
                //  console.log('filteredBenchMark capacity',filteredBenchMark)
                const benchMark = persentageCU >= filteredBenchMark ? 'high' : 'low'
                setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMark })
                //  console.log('filteredCU',filteredCU);
            }
            //---------OverallYeild---------------------
            const OverallYeildResponse = await apiService.OverallYeild();
            setYieldData(OverallYeildResponse.overallYeild_Forecast)
            if (OverallYeildResponse.status === 'success' && selectedPlants !== '' && selectedDate && benchMarkData) {
                const filteredOY = filterByDatePlant(OverallYeildResponse.overallYeild_Forecast, selectedDate, selectedPlants)
                const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
                const filteredBenchMarkO = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
                //  console.log('filteredBenchMarkO overyeiled',filteredBenchMarkO)
                const benchMarkY = persentageOY >= filteredBenchMarkO ? 'high' : 'low'
                setYieldCard({ cardValue: persentageOY, benchmark: benchMarkY })
            }

            //  //----------------------MatchingRateBetweenInvoicesAndReceipts------//
            const matchingRateResponse = await apiService.MatchingRateBetweenInvoicesAndReceiptsForecast();
            setMatchingRateData(matchingRateResponse.Matching_Rate_Between_Invoices_And_Receipts_Forecast)
            if (matchingRateResponse.status === 'success' && selectedPlants !== '' && selectedDate) {
                const filteredIMR = filterByDatePlant(matchingRateResponse.Matching_Rate_Between_Invoices_And_Receipts_Forecast, selectedDate, selectedPlants)
                const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
                setmatchingRatechart({
                    product: sumIMR.MATKL_Material_Category,
                    perf_score: sumIMR.Matching_Rate
                })
            }

            //------------ProductionCostperUnit---------------
            const productionCostUnitResponse = await apiService.ProductionCostperUnitForecast();
            setProductionCostUnitData(productionCostUnitResponse.Production_CostperUnit_Forecast)
            // console.log('fil 1',productionCostUnitResponse.Production_CostperUnit_Forecast);

            if (productionCostUnitResponse.status === 'success' && selectedPlants !== '' && selectedDate) {

                //---------------------------New code --------------------------------------
                const filteredPCU = filterByDatePlant(productionCostUnitResponse.Production_CostperUnit_Forecast, selectedDate, selectedPlants)
                const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
                // console.log('test', sumPCU);
                setProdUnitChart({
                    labels: sumPCU.MATKL_Material_Category,
                    series: sumPCU.Production_CostperUnit
                })
            }
            flagSet();

        } catch (error) {
            console.log("Error:", error.message)
        }
        finally {
            // setLoading(false);

        }

    };





    const fetchBenchMark = async () => {
        //--------------------Bench Mark -----------------------
        const benchMarkResponse = await apiService.benchmarkShow();
        if (benchMarkResponse.status === "Success") {
            // console.log('data', benchMarkResponse);
            setBenchMarkData(benchMarkResponse.client)

        }
    };


    // useEffect(() => {
    //     fetchBenchMark();
    //     fetchPlants();

    // }, []);

    // useEffect(() => {
    //     const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
    //     setSelectedDate(formattedDataDate);
    //     // console.log('first come value');
    //     fetchData();
    //     // Cleanup function (optional)
    //     return () => {
    //     };

    // }, [plants]);


    useEffect(() => {
        const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
        setSelectedDate(formattedDataDate);
        fetchBenchMark();
    }, []);

    useEffect(() => {
        fetchData();
    }, [plants]);


    useEffect(() => {
        fetchPlants();
    }, []);



    const handleDateChange = async (newValue) => {
        try {

            const formattedDataDate = dayjs(newValue).format('MMM YYYY');
            setSelectedDate(formattedDataDate);


            // if (selectedPlants === 'All' && selectedDate) {
            //     console.log('wip');
            // }

            if (selectedPlants === 'All' && selectedProduct === 'All' && selectedDate) {

                // // ----------OFA------------ (dont remove)
                // const filteredOFA = filterByDate(OrderFulfillmentAccuracyData, formattedDataDate)
                // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
                // const filteredBencnOFA = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
                // const benchMarkOFA = persentageOFA >= filteredBencnOFA ? 'high' : 'low'
                // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMarkOFA })

                //------------ProductionCostperUnit---------------
                const filteredPCU = filterByDate(productionCostUnitData, formattedDataDate)
                const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
                setProdUnitChart({
                    labels: sumPCU.MATKL_Material_Category,
                    series: sumPCU.Production_CostperUnit
                })
                //-------------------------------IMR------------------------------------
                const filteredIMR = filterByDate(matchingRateData, formattedDataDate)
                const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
                setmatchingRatechart({
                    product: sumIMR.MATKL_Material_Category,
                    perf_score: sumIMR.Matching_Rate
                })

                //------------Sales--------------------------
                // const filteredSales = filterByDatePlant(productCategoryWiseSalesData, formattedDataDate, selectedPlants)
                // const sumSales = calculateGroupByAverage(filteredSales, 'MATKL_Material_Category', 'ProductCategoryWiseSales');
                // setProductCategoryWiseSales({
                //     MATKL_Material_Category: sumSales.MATKL_Material_Category,
                //     ProductCategoryWiseSales: sumSales.ProductCategoryWiseSales
                // })
                //------------PPV--------------------------
                const filteredPPV = filterByDate(ProductionPlanVarianceData, formattedDataDate)
                const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
                const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
                const benchMarPV = persentagePPV >= benchMarkPPV ? 'high' : 'low'
                setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMarPV })

                //------------CU--------------------------
                const filteredCU = filterByDate(capacityUtilizationData, formattedDataDate)
                const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
                const filteredBenchCU = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
                const benchMarkCU = persentageCU >= filteredBenchCU ? 'high' : 'low'
                setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMarkCU })
                //------------OY--------------------------
                const filteredOY = filterByDate(yieldData, formattedDataDate)
                const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
                const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
                const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
                setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })


            }
            else if (selectedProduct === 'All' && selectedPlants !== 'All' && selectedDate) {
                console.log('handle date change else if');
                // // ----------OFA------------ dont remove
                // const filteredOFA = filterByDatePlant(OrderFulfillmentAccuracyData, formattedDataDate, selectedPlants)
                // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
                // const filteredBencnOFA = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
                // const benchMarkOFA = persentageOFA >= filteredBencnOFA ? 'high' : 'low'
                // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMarkOFA })

                //------------ProductionCostperUnit---------------
                const filteredPCU = filterByDatePlant(productionCostUnitData, formattedDataDate, selectedPlants)
                const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
                setProdUnitChart({
                    labels: sumPCU.MATKL_Material_Category,
                    series: sumPCU.Production_CostperUnit
                })
                //-------------------------------IMR------------------------------------
                const filteredIMR = filterByDatePlant(matchingRateData, formattedDataDate, selectedPlants)
                const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
                setmatchingRatechart({
                    product: sumIMR.MATKL_Material_Category,
                    perf_score: sumIMR.Matching_Rate
                })


                //------------PPV--------------------------
                const filteredPPV = filterByDatePlant(ProductionPlanVarianceData, formattedDataDate, selectedPlants)
                const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
                const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
                const benchMarPV = persentagePPV >= benchMarkPPV ? 'high' : 'low'
                setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMarPV })

                //------------CU--------------------------
                const filteredCU = filterByDatePlant(capacityUtilizationData, formattedDataDate, selectedPlants)
                const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
                const filteredBenchCU = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
                const benchMarkCU = persentageCU >= filteredBenchCU ? 'high' : 'low'
                setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMarkCU })
                //------------OY--------------------------
                const filteredOY = filterByDatePlant(yieldData, formattedDataDate, selectedPlants)
                const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
                const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
                const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
                setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })

            }
            else if (selectedProduct !== 'All' && selectedPlants === 'All' && selectedDate) {


                // // ----------OFA------------ dont remove
                // const filteredOFA = filterByDateProduct(OrderFulfillmentAccuracyData, formattedDataDate, selectedProduct)
                // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
                // const filteredBencnOFA = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
                // const benchMarkOFA = persentageOFA >= filteredBencnOFA ? 'high' : 'low'
                // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMarkOFA })

                //------------ProductionCostperUnit---------------
                const filteredPCU = filterByDateProduct(productionCostUnitData, formattedDataDate, selectedProduct)
                const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
                setProdUnitChart({
                    labels: sumPCU.MATKL_Material_Category,
                    series: sumPCU.Production_CostperUnit
                })
                //-------------------------------IMR------------------------------------
                const filteredIMR = filterByDateProduct(matchingRateData, formattedDataDate, selectedProduct)
                const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
                setmatchingRatechart({
                    product: sumIMR.MATKL_Material_Category,
                    perf_score: sumIMR.Matching_Rate
                })


                //------------PPV--------------------------
                const filteredPPV = filterByDateProduct(ProductionPlanVarianceData, formattedDataDate, selectedProduct)
                const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
                const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
                const benchMarPV = persentagePPV >= benchMarkPPV ? 'high' : 'low'
                setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMarPV })

                //------------CU--------------------------
                const filteredCU = filterByDateProduct(capacityUtilizationData, formattedDataDate, selectedProduct)
                const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
                const filteredBenchCU = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
                const benchMarkCU = persentageCU >= filteredBenchCU ? 'high' : 'low'
                setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMarkCU })
                //------------OY--------------------------
                const filteredOY = filterByDateProduct(yieldData, formattedDataDate, selectedProduct)
                const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
                const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
                const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
                setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })


            }
            else {
                console.log('else in the handleDateChange')
                // // ----------OFA------------ dont emove
                // const filteredOFA = filterByDatePlantProduct(OrderFulfillmentAccuracyData, formattedDataDate, selectedPlants, selectedProduct)
                // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
                // const filteredBencnOFA = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
                // const benchMarkOFA = persentageOFA >= filteredBencnOFA ? 'high' : 'low'
                // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMarkOFA })

                //------------ProductionCostperUnit---------------
                const filteredPCU = filterByDatePlantProduct(productionCostUnitData, formattedDataDate, selectedPlants, selectedProduct)
                const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
                setProdUnitChart({
                    labels: sumPCU.MATKL_Material_Category,
                    series: sumPCU.Production_CostperUnit
                })
                //-------------------------------IMR------------------------------------
                const filteredIMR = filterByDatePlantProduct(matchingRateData, formattedDataDate, selectedPlants, selectedProduct)
                const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
                setmatchingRatechart({
                    product: sumIMR.MATKL_Material_Category,
                    perf_score: sumIMR.Matching_Rate
                })


                //------------PPV--------------------------
                const filteredPPV = filterByDatePlantProduct(ProductionPlanVarianceData, formattedDataDate, selectedPlants, selectedProduct)
                const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
                const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
                const benchMarPV = persentagePPV >= benchMarkPPV ? 'high' : 'low'
                setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMarPV })

                //------------CU--------------------------
                const filteredCU = filterByDatePlantProduct(capacityUtilizationData, formattedDataDate, selectedPlants, selectedProduct)
                const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
                const filteredBenchCU = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
                const benchMarkCU = persentageCU >= filteredBenchCU ? 'high' : 'low'
                setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMarkCU })
                //------------OY--------------------------
                const filteredOY = filterByDatePlantProduct(yieldData, formattedDataDate, selectedPlants, selectedProduct)
                const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
                const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
                const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
                setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })

            }


        } catch (error) {
            console.error('Error fetching data for the selected date:', error.message);
        }
        flagSet()
    };

    const handlePlantChange = (event) => {
        const selectedValue = event
        setSelectedPlants(event);


        if (selectedValue === "All" && selectedProduct === 'All' && selectedDate) {
            console.log("All");
            // // ----------OFA------------ dobt remove

            // const filteredOFA = filterByDate(OrderFulfillmentAccuracyData, selectedDate)
            // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
            // const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
            // const benchMark = persentageOFA >= filteredBenchMark ? 'high' : 'low'
            // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMark })
            //------------PPV--------------------------
            const filteredPPV = filterByDate(ProductionPlanVarianceData, selectedDate)
            const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
            const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
            const benchMarPV = persentagePPV >= benchMarkPPV ? 'high' : 'low'
            setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMarPV })

            //------------ProductionCostperUnit---------------
            const filteredPCU = filterByDate(productionCostUnitData, selectedDate)
            const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
            // console.log('test', sumPCU);
            setProdUnitChart({
                labels: sumPCU.MATKL_Material_Category,
                series: sumPCU.Production_CostperUnit
            })
            //-------------------------------IMR------------------------------------
            const filteredIMR = filterByDate(matchingRateData, selectedDate)
            const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
            setmatchingRatechart({
                product: sumIMR.MATKL_Material_Category,
                perf_score: sumIMR.Matching_Rate
            })

            //------------Sales--------------------------
            // const filteredSales = filterByDate(productCategoryWiseSalesData, selectedDate)
            // const sumSales = calculateGroupByAverage(filteredSales, 'MATKL_Material_Category', 'ProductCategoryWiseSales');
            // setProductCategoryWiseSales({
            //     MATKL_Material_Category: sumSales.MATKL_Material_Category,
            //     ProductCategoryWiseSales: sumSales.ProductCategoryWiseSales
            // })
            //------------CU--------------------------
            const filteredCU = filterByDate(capacityUtilizationData, selectedDate)
            const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
            const filteredBenchCU = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
            const benchMarkCU = persentageCU >= filteredBenchCU ? 'high' : 'low'
            setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMarkCU })
            //------------OY--------------------------
            const filteredOY = filterByDate(yieldData, selectedDate)
            const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
            const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
            const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
            setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })

        }

        else if (selectedProduct === 'All' && selectedValue !== 'All' && selectedDate) {
            console.log('elseif part from dashboard')
            // // ----------OFA------------ dont remove

            // const filteredOFA = filterByDatePlant(OrderFulfillmentAccuracyData, selectedDate, selectedValue)
            // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
            // const filteredBenchMarkOFA = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
            // const benchMarkOFA = persentageOFA >= filteredBenchMarkOFA ? 'high' : 'low'
            // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMarkOFA })
            //------------PPV--------------------------
            const filteredPPV = filterByDatePlant(ProductionPlanVarianceData, selectedDate, selectedValue)
            const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
            const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
            const benchMar = persentagePPV >= benchMarkPPV ? 'high' : 'low'
            setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMar })

            // // -------CPU----------

            const filteredPCU = filterByDatePlant(productionCostUnitData, selectedDate, selectedValue)
            const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
            setProdUnitChart({
                labels: sumPCU.MATKL_Material_Category,
                series: sumPCU.Production_CostperUnit
            })
            //-------------------------------IMR------------------------------------
            const filteredIMR = filterByDatePlant(matchingRateData, selectedDate, selectedValue)
            const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
            setmatchingRatechart({
                product: sumIMR.MATKL_Material_Category,
                perf_score: sumIMR.Matching_Rate
            })

            //------------CU--------------------------
            const filteredCU = filterByDatePlant(capacityUtilizationData, selectedDate, selectedValue)
            const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
            const filteredBenchMark = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
            const benchMark = persentageCU >= filteredBenchMark ? 'high' : 'low'
            setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMark })
            //------------OY--------------------------
            const filteredOY = filterByDatePlant(yieldData, selectedDate, selectedValue)
            const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
            const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
            const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
            setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })


        }
        else if (selectedProduct !== 'All' && selectedValue === 'All' && selectedDate) {
            // // ----------OFA------------ dont remove
            // console.log('plan else if ');

            // const filteredOFA = filterByDateProduct(OrderFulfillmentAccuracyData, selectedDate, selectedProduct)
            // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
            // const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
            // const benchMark = persentageOFA >= filteredBenchMark ? 'high' : 'low'
            // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMark })
            //------------PPV--------------------------
            const filteredPPV = filterByDateProduct(ProductionPlanVarianceData, selectedDate, selectedProduct)
            const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
            const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
            const benchMar = persentagePPV >= benchMarkPPV ? 'high' : 'low'
            setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMar })

            // -------CPU----------
            const filteredPCU = filterByDateProduct(productionCostUnitData, selectedDate, selectedProduct)
            const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
            // console.log('test', sumPCU);
            setProdUnitChart({
                labels: sumPCU.MATKL_Material_Category,
                series: sumPCU.Production_CostperUnit
            })

            //-------------------------------IMR------------------------------------
            const filteredIMR = filterByDateProduct(matchingRateData, selectedDate, selectedProduct)
            const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
            setmatchingRatechart({
                product: sumIMR.MATKL_Material_Category,
                perf_score: sumIMR.Matching_Rate
            })


            //------------CU--------------------------
            const filteredCU = filterByDateProduct(capacityUtilizationData, selectedDate, selectedProduct)
            const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
            const filteredBencCU = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
            const benchMarkCU = persentageCU >= filteredBencCU ? 'high' : 'low'
            setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMarkCU })

            //------------OY--------------------------
            const filteredOY = filterByDateProduct(yieldData, selectedDate, selectedProduct)
            const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
            const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
            const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
            setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })

        }
        else {
            console.log('else part handle plant change')
            // // ----------OFA------------ dont remove 

            // const filteredOFA = filterByDatePlantProduct(OrderFulfillmentAccuracyData, selectedDate, selectedValue, selectedProduct)
            // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
            // const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
            // const benchMark = persentageOFA >= filteredBenchMark ? 'high' : 'low'
            // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMark })
            //------------PPV--------------------------
            const filteredPPV = filterByDatePlantProduct(ProductionPlanVarianceData, selectedDate, selectedValue, selectedProduct)
            const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
            const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
            const benchMar = persentagePPV >= benchMarkPPV ? 'high' : 'low'
            setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMar })

            // -------CPU----------
            const filteredPCU = filterByDatePlantProduct(productionCostUnitData, selectedDate, selectedValue, selectedProduct)
            const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
            // console.log('test', sumPCU);
            setProdUnitChart({
                labels: sumPCU.MATKL_Material_Category,
                series: sumPCU.Production_CostperUnit
            })

            //-------------------------------IMR------------------------------------
            const filteredIMR = filterByDatePlantProduct(matchingRateData, selectedDate, selectedValue, selectedProduct)
            const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
            setmatchingRatechart({
                product: sumIMR.MATKL_Material_Category,
                perf_score: sumIMR.Matching_Rate
            })


            //------------CU--------------------------
            const filteredCU = filterByDatePlantProduct(capacityUtilizationData, selectedDate, selectedValue, selectedProduct)
            const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
            const filteredBencCU = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
            const benchMarkCU = persentageCU >= filteredBencCU ? 'high' : 'low'
            setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMarkCU })

            //------------OY--------------------------
            const filteredOY = filterByDatePlantProduct(yieldData, selectedDate, selectedValue, selectedProduct)
            const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
            const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
            const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
            setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })


        }
        flagSet()
    };

    const productChange = async (selectedValue) => {
        setSelectedProduct(selectedValue)
        const selectedProductCate = selectedValue


        if (selectedPlants === "All" && selectedProductCate === 'All' && selectedDate) {
            console.log("All");
            // // ----------OFA------------ dont remove

            // const filteredOFA = filterByDate(OrderFulfillmentAccuracyData, selectedDate)
            // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
            // const filteredBenchMark = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
            // const benchMark = persentageOFA >= filteredBenchMark ? 'high' : 'low'
            // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMark })
            //------------PPV--------------------------
            const filteredPPV = filterByDate(ProductionPlanVarianceData, selectedDate)
            const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
            const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
            const benchMarPV = persentagePPV >= benchMarkPPV ? 'high' : 'low'
            setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMarPV })

            //------------ProductionCostperUnit---------------
            const filteredPCU = filterByDate(productionCostUnitData, selectedDate)
            const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
            // console.log('test', sumPCU);
            setProdUnitChart({
                labels: sumPCU.MATKL_Material_Category,
                series: sumPCU.Production_CostperUnit
            })
            //-------------------------------IMR------------------------------------
            const filteredIMR = filterByDate(matchingRateData, selectedDate)
            const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
            setmatchingRatechart({
                product: sumIMR.MATKL_Material_Category,
                perf_score: sumIMR.Matching_Rate
            })

            //------------Sales--------------------------
            // const filteredSales = filterByDate(productCategoryWiseSalesData, selectedDate)
            // const sumSales = calculateGroupByAverage(filteredSales, 'MATKL_Material_Category', 'ProductCategoryWiseSales');
            // setProductCategoryWiseSales({
            //     MATKL_Material_Category: sumSales.MATKL_Material_Category,
            //     ProductCategoryWiseSales: sumSales.ProductCategoryWiseSales
            // })
            //------------CU--------------------------
            const filteredCU = filterByDate(capacityUtilizationData, selectedDate)
            const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
            const filteredBenchCU = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
            const benchMarkCU = persentageCU >= filteredBenchCU ? 'high' : 'low'
            setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMarkCU })
            //------------OY--------------------------
            const filteredOY = filterByDate(yieldData, selectedDate)
            const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
            const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
            const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
            setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })

        }

        else if (selectedProductCate === 'All' && selectedPlants !== 'All' && selectedDate) {
            console.log('if log');

            // //-----------OFA--------------- dont remve
            // const filteredOFA = filterByDatePlant(OrderFulfillmentAccuracyData, selectedDate, selectedPlants)
            // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
            // const filteredBenchMarkOFA = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
            // const benchMarkOFA = persentageOFA >= filteredBenchMarkOFA ? 'high' : 'low'
            // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMarkOFA })

            //------------PPV--------------------------
            const filteredPPV = filterByDatePlant(ProductionPlanVarianceData, selectedDate, selectedPlants)
            const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
            const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
            const benchMar = persentagePPV >= benchMarkPPV ? 'high' : 'low'
            setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMar })

            // -------CPU----------

            const filteredPCU = filterByDatePlant(productionCostUnitData, selectedDate, selectedPlants)
            const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
            setProdUnitChart({
                labels: sumPCU.MATKL_Material_Category,
                series: sumPCU.Production_CostperUnit
            })
            //-------------------------------IMR------------------------------------

            const filteredIMR = filterByDatePlant(matchingRateData, selectedDate, selectedPlants)
            const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
            setmatchingRatechart({
                product: sumIMR.MATKL_Material_Category,
                perf_score: sumIMR.Matching_Rate
            })

            //------------CU--------------------------
            const filteredCU = filterByDatePlant(capacityUtilizationData, selectedDate, selectedPlants)
            const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
            const filteredBenchMark = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
            const benchMark = persentageCU >= filteredBenchMark ? 'high' : 'low'
            setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMark })

            //------------OY--------------------------
            const filteredOY = filterByDatePlant(yieldData, selectedDate, selectedPlants)
            const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
            const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
            const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
            setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })


        }
        else if (selectedPlants === 'All' && selectedProductCate !== 'All' && selectedDate) {
            console.log('client all');
            // OFa dont remove

            // const filteredOFA = filterByDateProduct(OrderFulfillmentAccuracyData, selectedDate, selectedProductCate)
            // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
            // const filteredBenchMarkOFA = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
            // const benchMarkOFA = persentageOFA >= filteredBenchMarkOFA ? 'high' : 'low'
            // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMarkOFA })

            //------------PPV--------------------------
            const filteredPPV = filterByDateProduct(ProductionPlanVarianceData, selectedDate, selectedProductCate)
            const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
            const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
            const benchMar = persentagePPV >= benchMarkPPV ? 'high' : 'low'
            setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMar })

            // -------CPU----------

            const filteredPCU = filterByDateProduct(productionCostUnitData, selectedDate, selectedProductCate)
            const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
            setProdUnitChart({
                labels: sumPCU.MATKL_Material_Category,
                series: sumPCU.Production_CostperUnit
            })
            //-------------------------------IMR------------------------------------

            const filteredIMR = filterByDateProduct(matchingRateData, selectedDate, selectedProductCate)
            const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
            setmatchingRatechart({
                product: sumIMR.MATKL_Material_Category,
                perf_score: sumIMR.Matching_Rate
            })

            //------------CU--------------------------
            const filteredCU = filterByDateProduct(capacityUtilizationData, selectedDate, selectedProductCate)
            const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
            const filteredBenchMark = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
            const benchMark = persentageCU >= filteredBenchMark ? 'high' : 'low'
            setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMark })

            //------------OY--------------------------
            const filteredOY = filterByDateProduct(yieldData, selectedDate, selectedProductCate)
            const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
            const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
            const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
            setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })


        }
        else {
            console.log('product change else part')
            // // OFA dont remove
            // const filteredOFA = filterByDatePlantProduct(OrderFulfillmentAccuracyData, selectedDate, selectedPlants, selectedProductCate)
            // const persentageOFA = calculateAveragePercentage(filteredOFA, 'Order_Fill_Rate')
            // const filteredBenchMarkOFA = filterBenchMarkData(benchMarkData, 'Order_Fulfillment_Accuracy_Forecast')
            // const benchMarkOFA = persentageOFA >= filteredBenchMarkOFA ? 'high' : 'low'
            // setOrderFulfillmentAccuracyCard({ cardValue: persentageOFA, benchmark: benchMarkOFA })

            //------------PPV--------------------------
            const filteredPPV = filterByDatePlantProduct(ProductionPlanVarianceData, selectedDate, selectedPlants, selectedProductCate)
            const persentagePPV = calculateAveragePercentage(filteredPPV, 'Production_PlanVariance')
            const benchMarkPPV = filterBenchMarkData(benchMarkData, 'Production_PlanVariance_Forecast')
            const benchMar = persentagePPV >= benchMarkPPV ? 'high' : 'low'
            setProductionPlanVarianceCard({ cardValue: persentagePPV, benchmark: benchMar })

            // -------CPU----------

            const filteredPCU = filterByDatePlantProduct(productionCostUnitData, selectedDate, selectedPlants, selectedProductCate)
            const sumPCU = calculateGroupByAverage(filteredPCU, 'MATKL_Material_Category', 'Production_CostperUnit');
            setProdUnitChart({
                labels: sumPCU.MATKL_Material_Category,
                series: sumPCU.Production_CostperUnit
            })
            //-------------------------------IMR------------------------------------

            const filteredIMR = filterByDatePlantProduct(matchingRateData, selectedDate, selectedPlants, selectedProductCate)
            const sumIMR = calculateGroupByAverage(filteredIMR, 'MATKL_Material_Category', 'Matching_Rate');
            setmatchingRatechart({
                product: sumIMR.MATKL_Material_Category,
                perf_score: sumIMR.Matching_Rate
            })

            //------------CU--------------------------
            const filteredCU = filterByDatePlantProduct(capacityUtilizationData, selectedDate, selectedPlants, selectedProductCate)
            const persentageCU = calculateAveragePercentage(filteredCU, 'CapacityUtilization')
            const filteredBenchMark = filterBenchMarkData(benchMarkData, 'CapacityUtilization_Forecast')
            const benchMark = persentageCU >= filteredBenchMark ? 'high' : 'low'
            setCapacityUtilizationCard({ cardValue: persentageCU, benchmark: benchMark })

            //------------OY--------------------------
            const filteredOY = filterByDatePlantProduct(yieldData, selectedDate, selectedPlants, selectedProductCate)
            const persentageOY = calculateAveragePercentage(filteredOY, 'OverallYield')
            const filteredBenchMarkOY = filterBenchMarkData(benchMarkData, 'overallYeild_Forecast')
            const benchMarkOY = persentageOY >= filteredBenchMarkOY ? 'high' : 'low'
            setYieldCard({ cardValue: persentageOY, benchmark: benchMarkOY })

        };
        flagSet()
    }

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Grid container spacing={2}>
                    <Grid item xs={3} md={3}>
                        <Typography
                            variant="h2"
                            color={colors.grey[100]}
                            fontWeight="bold"
                            sx={{ m: "0 0 5px 5px" }}
                        >Production</Typography>
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
            </Box>
            <Grid container spacing={2} mt={1}>
                {/* dont remove the commented order fullfillment accurancy code  */}

                {/* <Grid item xs={3} md={3}>
                    <GlobalCard
                        title="Order Fulfilment Accuracy"
                        subtitle={loading ? 'Loading...' : OrderFulfillmentAccuracyCard.cardValue?.toString() ?? '0'}
                        tooltipContent="Order fulfillment accuracy is critical for customer satisfaction, operational efficiency, and compliance, as inaccuracies can lead to customer loss, increased costs, and legal risks."
                        units="%"
                        benchmark={OrderFulfillmentAccuracyCard.benchmark}
                        style={{ minHeight: '100px', maxHeight: '150px' }}
                    />
                </Grid> */}
                <Grid item xs={3} md={3}>
                    <GlobalCard
                        title="Production Plan Variance"
                        subtitle={loading ? 'Loading...' : ProductionPlanVarianceCard.cardValue?.toString() ?? 'Loading...'}
                        tooltipContent="Order fulfillment accuracy is critical for customer satisfaction, operational efficiency, and compliance, as inaccuracies can lead to customer loss, increased costs, and legal risks."
                        units="%"
                        benchmark={ProductionPlanVarianceCard.benchmark}
                        style={{ minHeight: '100px', maxHeight: '150px' }}
                    />
                </Grid>
                <Grid item xs={3} md={3}>
                    <GlobalCard
                        title="Capacity Utilization"
                        subtitle={loading ? 'Loading...' : capacityUtilizationCrad.cardValue?.toString() ?? 'Loading...'}
                        tooltipContent="Capacity utilization is a manufacturing efficiency metric that measures how much of a production line's available capacity is being used. It is calculated by dividing the actual factory utilization by the total productive capacity"
                        units="%"
                        benchmark={capacityUtilizationCrad.benchmark}
                        style={{ minHeight: '100px', maxHeight: '150px' }}
                    />
                </Grid>
                <Grid item xs={3} md={3}>
                    <GlobalCard
                        title="Yield"
                        subtitle={loading ? 'Loading...' : yieldCard.cardValue?.toString() ?? 'Loading...'}
                        tooltipContent="Order fulfillment accuracy is critical for customer satisfaction, operational efficiency, and compliance, as inaccuracies can lead to customer loss, increased costs, and legal risks."
                        units="%"
                        benchmark={yieldCard.benchmark}
                        style={{ minHeight: '100px', maxHeight: '150px' }}
                    />
                </Grid>

            </Grid>

            <Grid container spacing={2} mt={1}>
                <Grid item xs={6} md={6}>
                    {/* <label >Matching Rate between Invoices and Receipts </label> */}
                    <PieCharts
                        labels={matchingRateChart.product}
                        flag={matchingRateChartLoder}
                        series={matchingRateChart.perf_score}
                        tilesLables="Invoices Matching Rate by Product Category"
                        height='320'
                    />
                </Grid>

                <Grid item xs={6} md={6}>
                    {/* <StackedColumnChart
                        series={prodUnitChart.series}
                        labels={prodUnitChart.labels}
                        height='350'
                        legend='Production Cost (Million)'
                    /> */}
                    <DistributedColumnChart
                        series={prodUnitChart.series}
                        labels={prodUnitChart.labels}
                        flag={prodUnitChartLoder}
                        tilesLables="Production Cost per Product Category"
                        height='350'
                        legend='Production Cost (₹)'
                        format_func={formatRuppes}
                        format_Tooltip={formatRuppesTooltip}
                    />
                </Grid>
            </Grid>
            {/* <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={12}>
                    <label >Product Category Wise Sales</label>
                    <BarCharts
                        series={productCategoryWiseSales.ProductCategoryWiseSales}
                        labels={productCategoryWiseSales.MATKL_Material_Category}
                        height='350' legend=' Sales (₹)'
                        format_func={formatRuppes}
                        format_Tooltip={formatRuppesTooltip}
                    />
                </Grid>
            </Grid> */}
            <SimpleBackdrop open={loading} handleClose={() => { }} size={80} />
        </Box>
    );
};


export default Production;