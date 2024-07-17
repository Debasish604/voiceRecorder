import React from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import GlobalCard from "../../../components/GlobalCard";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from "react";
import { apiService } from "../../../service/api-service";
import ProductSelect from "../../../components/dropdown/ProductCategory";

import {
    // ****Sales*********
    calculateAverage,
    calculateGroupByAverage,
    filterByDate,
    dateFormationDataKey,
    filterByDateProduct,
    filterByDateRegion,
    filterByDateRegionProduct,
    formatRuppes,

    // ******billing******
    formatDays,
    calculateAveragePercentage,
    filterBenchMarkData,
    filterByDateAndCustomer,
    filterByDateCustomerProduct,

    // *******Collection*********
    formatPersentage,
    filterByDateAndCustomerALT,
    filterByDateAndCustomerN,
    filterByDateCustomerProductALT,
    filterByDateCustomerProductN,
    filterByDateAndCustomerOPT,
    filterByDateClientProduct,
    filterByDateCustomerProductRegionN,
    filterByDateRouteDealerProduct,
    filterByDateRouteDealerProductSales,
    lowerfilterByDateRouteDealerProductSales,
    lowerfilterByDateRouteDealerSales,
    lowerfilterByDateRouteDealerProduct,
    filterByDateRouteDealerSales,
    filterByDateDealerProductSales,
    lowerfilterByDateDealerProductSales,
    filterByDateRouteDProductsales,
    lowerfilterByDateRouteDProductsales,
    filterByDateRouteDealerSalesmanForecast,
    filterByDateRouteDealerSalesman,
    filterByDatesales


} from '../../../utils/GlobalFilters';



import DistributedColumnChart from '../../../components/charts/DistributedColumnChart';
import BarCharts from '../../../components/charts/Barchart';
import SimpleBackdrop from '../../../scenes/global/Loader';
import CompanyWiseTotalInvoiceAmount from '../../supplychain/billing/Company_Wise_TotalInvoiceAmount';
import PieCharts from '../../../components/charts/PieCharts';
import { useLocation } from 'react-router-dom';





const SalesModule = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const showAllOption = true; 
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [selectedDate, setSelectedDate] = useState('');
    const [monthYear, setmonthYear] = useState('Select month and year');
    const currentDate = new Date();
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    //-------------------- Bench mark----------------
    const [benchMarkData, setBenchMarkData] = useState([])

    const [products, setproducts] = useState([]);

    const [selectedPlants, setSelectedPlants] = useState('');

    // ******************************************SALES**************************************************

    //----------------------------Total_Sales_Revenue_Forecast-------------Total Sales Revenue (Gross Sales)
    const [totalSalesRevenueData, settotalSalesRevenueData] = useState([]);
    // const [totalSalesRevenueCard, settotalSalesRevenueCard] = useState();
    const [totalSalesRevenueCard, settotalSalesRevenueCard] = useState({ cardValue: null, benchmark: null })

    //----------------------------Calculate_Total_NumberOfCustomers_Forecast---------------(Number of Customers)
    const [calculateTotalNumberOfCustomersForecastData, setcalculateTotalNumberOfCustomersForecastData] = useState([]);
    //  const [calculateTotalNumberOfCustomersForecastCard, setcalculateTotalNumberOfCustomersForecastCard] = useState();
    //  const [calculateTotalNF, setcalculateTotalNF] = useState({ REGION: [], NumberOfCustomers: [] })
    const [calculateTotalNumberOfCustomersForecastCard, setcalculateTotalNumberOfCustomersForecastCard] = useState({ cardValue: null, benchmark: null })

    //------------------------------Total_Sales_Volume_Quantity_Forecast---------------(Total Sales by Product Category)
    const [totalSalesVolumeQuantityForecastData, settotalSalesVolumeQuantityForecastData] = useState([]);
    const [totalSalesVQF, settotalSalesVQF] = useState({ MATKL_Material_Category: [], Total_Sales_Volume_Quantity: [] })
    const [totalSalesVQFLoder, settotalSalesVQFLoder] = useState(0)

    //------------------------------Sales by Region ----------------------(Total Sales by Region)
    const [totalSalesbyRegionData, settotalSalesbyRegionData] = useState([]);
    const [totalSalesSBR, settotalSalesSBR] = useState({ REGION: [], Total_Sales_Volume_Quantity: [] })
    const [totalSalesSBRLoder, settotalSalesSBRLoder] = useState(0)
    // *********************************************Salesman***********************************************************
    const [selectedSalesman, setselectedSalesman] = useState('');
    const [salesData, setSalesman] = useState([]);


    // *********************************************billing***********************************************************
    const [selectedClient, setSelectedClient] = useState('');
    const [clients, setClients] = useState([]);


    //-------------------Late Payment Rate------------------------
    const [latePaymentRateData, setLatePaymentRateData] = useState([])
    const [latePaymentRateCard, setLatePaymentRateCard] = useState({ cardValue: null, benchmark: null })

    //--------------------Invoice Processing Time----------------
    const [invoiceProcessingTimeData, setInvoiceProcessingTimeData] = useState([])
    const [invoiceProcessingTime, setInvoiceProcessingTime] = useState({ DaysToComplete: [], Delivary_Date: [] })
    const [invoiceProcessingTimeLoder, setInvoiceProcessingTimeLoder] = useState(0)

    //--------------------Total Amount Invoiced per Plant----------------------
    const [amountInvPerPlantData, setAmountInvPerPlantData] = useState([])
    const [amountInvPerPlant, setAmountInvPerPlant] = useState({ Total_Amount_Invoiced: [], customer_name: [] })
    const [amountInvPerPlantLoder, setAmountInvPerPlantLoder] = useState(0)

    //--------------------Company_Wise_Total_Invoice_Amount----------------
    const [companywiseTotalInvoiceAmountData, setCompanywiseTotalInvoiceAmountData] = useState()
    const [companywiseTotalInvoiceAmountFilter, setCompanywiseTotalInvoiceAmountFilter] = useState()
    //--------------------Billed Value----------------
    const [billedValueData, setBilledValueData] = useState([])
    const [billedValueCard, setBilledValueCard] = useState({ cardValue: null, benchmark: null })
    const [billedValueChart, setBilledValueChart] = useState({ product_cat: [], order_value: [] })
    const [billedValueChartLoder, setBilledValueChartLoder] = useState(0)

    //--------------------------Days of Sales Outstanding-----------
    const [dsoData, setDsoData] = useState([])
    const [dsoCard, setDsoCard] = useState({ cardValue: null, benchmark: null })

    //--------------------------Operating Profit-----------------------
    const [operatingData, setOperatingData] = useState([])
    const [operatingCard, setOperatingCard] = useState({ cardValue: null, benchmark: null })


    // ***********************Collection*************************

    //------------Cash To Cash Cycle Time---------------
    const [CashToCashCycleTimeData, setCashToCashCycleTimeData] = useState([])
    const [AverageCashToCashCycleTimeCard, setAverageCashToCashCycleTimeCard] = useState({ cardValue: null, benchmark: null })

    //-------------------Product Return Rate ------------------------
    const [productReturnRateData, setProductReturnRateData] = useState([])

    const [ProductReturnRateByYear, setProductReturnRateByYear] = useState({ ProductReturnRate: [], MTEXT_ClientName: [] })
    const [ProductReturnRateByYearLoder, setProductReturnRateByYearLoder] = useState(0)

    //-------------------------Order To Cash Cycle Time ------------
    const [OrderToCashCycleTimeData, setOrderToCashCycleTimeData] = useState([])
    const [OrderToCashCycleTimeCard, setOrderToCashCycleTimeCard] = useState({ cardValue: null, benchmark: null })
    //------------------------- Procurement Cost Savings -----------------
    const [ProcurementCostSavingsData, setProcurementCostSavingsData] = useState([])
    const [ProcurementCostSavingsCard, setProcurementCostSavingsCard] = useState({ cardValue: null, benchmark: null })
    //------------------------- Transportation Cost of Revenue ---------------------------
    const [TransportationCostofRevenueData, setTransportationCostofRevenueData] = useState([])
    const [TransportationCostofRevenueCard, setTransportationCostofRevenueCard] = useState({ cardValue: null, benchmark: null })


    const [onShowAnamoly, setOnAnamoly] = useState(true);








    const fetchSalesData = async () => {

        try {
            const totalSalesRevenueResponse = await apiService.TotalSalesRevenueForecast();
            settotalSalesRevenueData(totalSalesRevenueResponse.Total_Sales_Revenue_Forecast);
            // console.log('settotalSalesRevenueData',totalSalesRevenueResponse)
            if (totalSalesRevenueResponse.status === 'success' && selectedDate) {
                const filteredTC = filterByDate(totalSalesRevenueResponse.Total_Sales_Revenue_Forecast, selectedDate)
                // console.log('filteredTC',filteredTC)
                const persentageQS = calculateAverage(filteredTC, 'Total_Sales_Revenue')
                const filteredBenchMark = filterBenchMarkData(benchMarkData, 'LatePaymentRate_Forecast')
                const benchMark = persentageQS >= filteredBenchMark ? 'high' : 'low'
                settotalSalesRevenueCard({ cardValue: persentageQS, benchmark: benchMark })
                

            }
            //------------------------------Total_Sales_Volume_Quantity_Forecast----------------------
            const totalSalesVolumeQuantityForecastResponse = await apiService.TotalSalesVolumeQuantityForecast();
            settotalSalesVolumeQuantityForecastData(totalSalesVolumeQuantityForecastResponse.Total_Sales_Volume_Quantity_Forecast);

            if (totalSalesVolumeQuantityForecastResponse.status === 'success' && selectedDate) {
                const filteredTC = filterByDate(totalSalesVolumeQuantityForecastResponse.Total_Sales_Volume_Quantity_Forecast, selectedDate)
                const totalSalesVolumeQuantityForecastResult = calculateGroupByAverage(filteredTC, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
                settotalSalesVQF({
                    MATKL_Material_Category: totalSalesVolumeQuantityForecastResult.MATKL_Material_Category,
                    Total_Sales_Volume_Quantity: totalSalesVolumeQuantityForecastResult.Total_Sales_Volume_Quantity
                })
            }

            //------------------------------Calculate_Total_NumberOfCustomers_Forecast----------------------
            const calculateTotalNumberOfCustomersForecastResponse = await apiService.CalculateTotalNumberOfCustomersForecast();
            setcalculateTotalNumberOfCustomersForecastData(calculateTotalNumberOfCustomersForecastResponse.Calculate_Total_NumberOfCustomers_Forecast);
            if (calculateTotalNumberOfCustomersForecastResponse.status === 'success' && selectedDate) {

                const filteredQS = filterByDate(calculateTotalNumberOfCustomersForecastResponse.Calculate_Total_NumberOfCustomers_Forecast, selectedDate)
                const persentageQS = calculateAverage(filteredQS, 'NumberOfCustomers')
                setcalculateTotalNumberOfCustomersForecastCard(persentageQS)

            }

            //------------------------------Sales by Region ----------------------
            const totalSalesByRegionResponse = await apiService.TotalSalesVolumeQuantityForecast();
            settotalSalesbyRegionData(totalSalesByRegionResponse.Total_Sales_Volume_Quantity_Forecast);
            // console.log("Sales by Region data", totalSalesbyRegionData);

            if (totalSalesByRegionResponse.status === 'success' && selectedDate) {
                const filteredQS = filterByDate(totalSalesByRegionResponse.Total_Sales_Volume_Quantity_Forecast, selectedDate)
                const totalSalesByRegiontResult = calculateGroupByAverage(filteredQS, 'REGION', 'Total_Sales_Volume_Quantity');
                settotalSalesSBR({
                    REGION: totalSalesByRegiontResult.REGION,
                    Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
                })
            }

        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
        }
        flagSet();
    };

    const fetchBillingData = async () => {

        try {
            //setLoading(true);

            //------------Late Payment Rate---------------
            const latePaymentRateResponse = await apiService.LatePaymentRate();
            setLatePaymentRateData(latePaymentRateResponse.LatePaymentRate_Forecast)
            if (latePaymentRateResponse.status === 'success' && selectedDate) {
                const filteredLPR = filterByDate(latePaymentRateResponse.LatePaymentRate_Forecast, selectedDate)
                const persentageLPR = calculateAveragePercentage(filteredLPR, 'LatePaymentRate')
                const filteredBenchMark = filterBenchMarkData(benchMarkData, 'LatePaymentRate_Forecast')
                const benchMark = persentageLPR >= filteredBenchMark ? 'high' : 'low'
                setLatePaymentRateCard({ cardValue: persentageLPR, benchmark: benchMark })
            }

            //--------------------Invoice Processing Time----------------------------
            const invoiceProcessingTimeResponse = await apiService.InvoiceProcessingTime();
            setInvoiceProcessingTimeData(invoiceProcessingTimeResponse.InvoiceProcessingTime_Forecast)
            if (invoiceProcessingTimeResponse.status === 'success' && selectedDate) {
                const filteredIPT = filterByDate(invoiceProcessingTimeResponse.InvoiceProcessingTime_Forecast, selectedDate)
                const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
                setInvoiceProcessingTime({
                    DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
                    Delivary_Date: invoiceProcessingTimeResult.customer_name
                })
            }
            //-------------------Amount Invoiced per Plant-----------------------------
            const amountInvPerPlantResponse = await apiService.AmountInvPerPlant();
            setAmountInvPerPlantData(amountInvPerPlantResponse.AmountInvoicedperPlant_Forecast)
            if (amountInvPerPlantResponse.status === 'success' && selectedDate) {
                const filteredTAIP = filterByDate(amountInvPerPlantResponse.AmountInvoicedperPlant_Forecast, selectedDate)
                const amountInvPerPlantResult = calculateGroupByAverage(filteredTAIP, 'customer_name', 'Total_Amount_Invoiced');
                setAmountInvPerPlant({
                    Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
                    customer_name: amountInvPerPlantResult.customer_name
                });

            }
            //------------------Company_Wise_Total_Invoice_Amount---------(Table)
            const companywiseTotalInvoiceAmountResponse = await apiService.Company_Wise_Total_Invoice_Amount();
            setCompanywiseTotalInvoiceAmountData(companywiseTotalInvoiceAmountResponse.CompanyWiseTotalInvoiceAmount_Forecast)
            if (companywiseTotalInvoiceAmountResponse.status === 'success' && selectedDate) {
                const filteredTAIP = filterByDate(companywiseTotalInvoiceAmountResponse.CompanyWiseTotalInvoiceAmount_Forecast, selectedDate)
                setCompanywiseTotalInvoiceAmountFilter(filteredTAIP)
            }
            //-------------------Billed Value-------------------
            const billedValueResponse = await apiService.BilledValue();
            if (billedValueResponse.status === 'success' && selectedDate) {
                setBilledValueData(billedValueResponse.Build_Values_Forecast)
                const filteredBV = filterByDate(billedValueResponse.Build_Values_Forecast, selectedDate)
                const avarageBV = calculateAverage(filteredBV, 'OrderValue')
                setBilledValueCard({ cardValue: avarageBV, benchmark: 'high' })
                const avarageBVChart = calculateGroupByAverage(filteredBV, 'MATKL_Material_Category', 'OrderValue');
                setBilledValueChart({
                    product_cat: avarageBVChart.MATKL_Material_Category,
                    order_value: avarageBVChart.OrderValue
                });

                //------------------------- Days of Sales Outstanding ----------------------
                const DsoResponse = await apiService.Dso();
                setDsoData(DsoResponse.Days_of_Sales_Outstanding)
                if (DsoResponse.status === 'success' && selectedDate) {
                    const filteredDSO = filterByDate(DsoResponse.Days_of_Sales_Outstanding, selectedDate)
                    const averageDSO = calculateAverage(filteredDSO, 'DSO')
                    const filteredBenchMarkdso = filterBenchMarkData(benchMarkData, 'Build_Values_Forecast')
                    const benchMarkDSO = averageDSO >= filteredBenchMarkdso ? 'high' : 'low'
                    setDsoCard({ cardValue: averageDSO, benchmark: benchMarkDSO })
                    //console.log('TransportationCostofRevenueCard', TransportationCostofRevenueCard);
                }

                //------------------------- Operating Profit------------------------
                const OperatingResponse = await apiService.OperatingProfit();
                setOperatingData(OperatingResponse.CalculateOperating_Profit)
                if (OperatingResponse.status === 'success' && selectedDate) {
                    const filteredOP = filterByDate(OperatingResponse.CalculateOperating_Profit, selectedDate)
                    const averageOP = calculateAverage(filteredOP, 'GrossProfit')
                    const filteredBenchMarkOP = filterBenchMarkData(benchMarkData, 'CalculateOperating_Profit')
                    const benchMarkOP = averageOP >= filteredBenchMarkOP ? 'high' : 'low'
                    setOperatingCard({ cardValue: averageOP, benchmark: benchMarkOP })
                }
            }

        } catch (error) {
            console.error('Error fetching Data', error.message);
        }
        finally {
        }
    };

    const fetchCollectionData = async () => {
        try {

            //-------------------------Cash To Cash Cycle Time---------------------------
            const CashToCashCycleTimeResponse = await apiService.CashToCashCycleTime();
            setCashToCashCycleTimeData(CashToCashCycleTimeResponse.CashtocashCycleTime)
            // console.log("CCT ", CashToCashCycleTimeData);
            if (CashToCashCycleTimeResponse.status === 'success' && selectedDate) {
                const filteredIPT = filterByDate(CashToCashCycleTimeResponse.CashtocashCycleTime, selectedDate)
                const AverageCTCCT = calculateAverage(filteredIPT, 'CashToCashCycleTime')
                const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
                const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
                setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })
            }



            //-------------------------Order To Cash Cycle Time ---------------------------
            const OrderToCashCycleTimeResponse = await apiService.OrderToCashCycleTime();
            setOrderToCashCycleTimeData(OrderToCashCycleTimeResponse.OrderToCashCycleTime)
            // console.log("Order To Cash Cycle Time ", OrderToCashCycleTimeData);

            if (OrderToCashCycleTimeResponse.status === 'success' && selectedDate) {
                // const filteredOTCCT = filterByDateAndClient(OrderToCashCycleTimeResponse.OrderToCashCycleTime, selectedDate, selectedClient)
                const filteredOTCCT = filterByDate(OrderToCashCycleTimeResponse.OrderToCashCycleTime, selectedDate)
                const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
                // console.log("CCT SUM", filteredOTCCT);
                // setOrderToCashCycleTimeCard(averageOTCCT)
                const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
                const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
                setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
                //console.log('OrderToCashCycleTimeCard', OrderToCashCycleTimeCard);
            }



            //------------------------- Procurement Cost Savings ---------------------------
            const ProcurementCostSavingsResponse = await apiService.ProcurementCostSavings();
            setProcurementCostSavingsData(ProcurementCostSavingsResponse.ProcurementCostSavings_Forecast)
            // console.log("CCT ", ProcurementCostSavingsResponse.ProcurementCostSavings_Forecast);
            if (ProcurementCostSavingsResponse.status === 'success' && selectedDate) {
                const filteredPCS = filterByDate(ProcurementCostSavingsResponse.ProcurementCostSavings_Forecast, selectedDate)
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

            if (TransportationCostofRevenueResponse.status === 'success' && selectedDate) {
                const filteredTCOR = filterByDate(TransportationCostofRevenueResponse.TransportationCostofRevenue_Forecast, selectedDate)
                const averageTCOR = calculateAverage(filteredTCOR, 'Transportation_Cost_as_a_Percentage_of_Revenue')
                
                const filteredBenchMarkTCOR = filterBenchMarkData(benchMarkData, 'Transportation_Cost_as_a_Percentage_of_Revenue')
                const benchMarkTCOR = averageTCOR >= filteredBenchMarkTCOR ? 'high' : 'low'
                setTransportationCostofRevenueCard({ cardValue: averageTCOR, benchmark: benchMarkTCOR })
            }


            //--------------------Product Return Rate by Year ----------------------------

            const ProductReturnRatebyYearResponse = await apiService.ProductReturnRate();
            setProductReturnRateData(ProductReturnRatebyYearResponse.ProductReturnRate)
            // console.log("ProductReturnRatebyYearResponse", ProductReturnRatebyYearResponse.ProductReturnRate);
            if (ProductReturnRatebyYearResponse.status === 'success' && selectedDate) {
                const filteredPRRY = filterByDate(ProductReturnRatebyYearResponse.ProductReturnRate, selectedDate)
                // console.log('data filter', filteredPRRY);
                const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
                // console.log("productReturnRatebyYearResult", productReturnRatebyYearResult);
                setProductReturnRateByYear({
                    ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
                    MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
                })
            }


        } catch (error) {
            // console.error('Error fetching data:', error.message);
        }
        finally {
            //setLoading(false);
        }
    };


    const fetchFilterData = async () => {
        try {
            const response = await apiService.filterdropdown();
            const regionData = response.Region || [];
            const clientData = response.customer_name || [];
            const SalesmanData = response.Salesperson || [];
            const productData = response.Product_Category || [];
            setRegions(regionData);
            setClients(clientData);
            setSalesman(SalesmanData);
            setproducts(productData);
            if (regionData.length > 0) {
                setSelectedRegion('All');
                setSelectedClient('All');
                setselectedSalesman('All');
                setSelectedProduct('All');
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

        }
    }


    useEffect(() => {
        // fetchRegion();
        // billing
        fetchBenchMark()
        fetchFilterData()

    }, []);


    useEffect(() => {
        const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
        setSelectedDate(formattedDataDate);
        setmonthYear('Selected month and year');
        fetchSalesData();
        return () => {
        };
    }, [regions]);



    // *******billing use effect *******

    useEffect(() => {
        const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
        setSelectedDate(formattedDataDate)
        fetchBillingData();
        // for collection
        // anamolyShow()
        fetchCollectionData();

        return () => {
        };
    }, [clients]);
    const handleDateChange = (newValue) => {
        try {
            const formattedDataDate = dayjs(newValue).format('MMM YYYY');
            setSelectedDate(formattedDataDate);
            // console.log('Selected date:', for
            // ***************************sales***********************************************Operating Profit

            //------------------------------Total_Sales_Revenue_Forecast--------------------
            const filterdTSR = filterByDate(totalSalesRevenueData, formattedDataDate)
            const persentageQS = calculateAverage(filterdTSR, 'Total_Sales_Revenue')
            const filteredBenchMarTSRF = filterBenchMarkData(benchMarkData, 'Total_Sales_Revenue_Forecast')
            const benchMarkTC = persentageQS >= filteredBenchMarTSRF ? 'high' : 'low'
            settotalSalesRevenueCard({ cardValue: persentageQS, benchmark: benchMarkTC })

            //------------------------------Calculate_Total_NumberOfCustomers_Forecast----------------------
            const filteredTC = filterByDate(calculateTotalNumberOfCustomersForecastData, formattedDataDate)
            const persentageTC = calculateAverage(filteredTC, 'NumberOfCustomers')
            const filteredBenchMarkTNF = filterBenchMarkData(benchMarkData, 'Calculate_Total_NumberOfCustomers_Forecast')
            const benchMarkTNF = persentageTC >= filteredBenchMarkTNF ? 'high' : 'low'
            setcalculateTotalNumberOfCustomersForecastCard({ cardValue: persentageTC, benchmark: benchMarkTNF })

            //   //------------------------------Total_Sales_Volume_Quantity_Forecast----------------------
            const filteredSR = filterByDate(totalSalesbyRegionData, formattedDataDate)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })
            //------------------------------Sales by Region ----------------------
            const filteredSR2 = filterByDate(totalSalesVolumeQuantityForecastData, formattedDataDate)
            const totalSalesVolumeQuantityForecastResult = calculateGroupByAverage(filteredSR2, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            settotalSalesVQF({
                MATKL_Material_Category: totalSalesVolumeQuantityForecastResult.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: totalSalesVolumeQuantityForecastResult.Total_Sales_Volume_Quantity
            })
            //-------------IPP-------------------
            const filteredIPP = filterByDate(amountInvPerPlantData, formattedDataDate)
            const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
            setAmountInvPerPlant({
                Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
                customer_name: amountInvPerPlantResult.customer_name
            });
            //-------------TIA-------------------
            const filteredTIA = filterByDate(companywiseTotalInvoiceAmountData, formattedDataDate)
            setCompanywiseTotalInvoiceAmountFilter(filteredTIA)

            //-------------IPT-------------------
            const filteredIPT = filterByDate(invoiceProcessingTimeData, formattedDataDate)
            const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
            setInvoiceProcessingTime({
                DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
                Delivary_Date: invoiceProcessingTimeResult.customer_name
            })
            //-------------Billed Value---------------
            const filteredBV = filterByDate(billedValueData, formattedDataDate)
            const avarageBV = calculateAverage(filteredBV, 'OrderValue')
            setBilledValueCard({ cardValue: avarageBV, benchmark: 'high' })
            const avarageBVChart = calculateGroupByAverage(filteredBV, 'MATKL_Material_Category', 'OrderValue');
            setBilledValueChart({
                product_cat: avarageBVChart.MATKL_Material_Category,
                order_value: avarageBVChart.OrderValue
            });


            // ----------LPR------------
            const filteredLPR = filterByDate(latePaymentRateData, formattedDataDate)
            const persentageLPR = calculateAveragePercentage(filteredLPR, 'LatePaymentRate')
            const filteredBenchMark = filterBenchMarkData(benchMarkData, 'LatePaymentRate_Forecast')
            const benchMark = persentageLPR >= filteredBenchMark ? 'high' : 'low'
            setLatePaymentRateCard({ cardValue: persentageLPR, benchmark: benchMark })

            //-------------------------Days of Sales Outstanding---------------------------
            const filteredDSO = filterByDate(dsoData, formattedDataDate)
            const averageDSO = calculateAverage(filteredDSO, 'DSO')
            const filteredBenchMarkdso = filterBenchMarkData(benchMarkData, 'Build_Values_Forecast')
            const benchMarkDSO = averageDSO >= filteredBenchMarkdso ? 'high' : 'low'
            setDsoCard({ cardValue: averageDSO, benchmark: benchMarkDSO })
            //-------------------------Operating Profit---------------------------------------
            const filteredOP = filterByDate(operatingData, formattedDataDate)
            // console.log('filteredOP',filteredOP)
            const averageOP = calculateAverage(filteredOP, 'GrossProfit')
            const filteredBenchMarkOP = filterBenchMarkData(benchMarkData, 'CalculateOperating_Profit')
            const benchMarkOP = averageOP >= filteredBenchMarkOP ? 'high' : 'low'
            setOperatingCard({ cardValue: averageOP, benchmark: benchMarkOP })

            //-------------------------Cash To Cash Cycle Time---------------------------
            const filteredCTCCT = filterByDate(CashToCashCycleTimeData, formattedDataDate)
            const AverageCTCCT = calculateAverage(filteredCTCCT, 'CashToCashCycleTime')
            const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
            const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
            setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })

            //------------Order To Cash Cycle Time --------------
            const filteredOTCCT = filterByDate(OrderToCashCycleTimeData, formattedDataDate)
            const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
            const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
            const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
            setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
            //console.log('OrderToCashCycleTimeCard', OrderToCashCycleTimeCard);

            //--------------Procurement Cost Savings --------------
            const filteredPCS = filterByDate(ProcurementCostSavingsData, formattedDataDate)
            const averagePCS = calculateAverage(filteredPCS, 'Procurement_Cost_Savings')
            const filteredBenchMarkPCS = filterBenchMarkData(benchMarkData, 'Procurement_Cost_Savings')
            const benchMarkPCS = averagePCS >= filteredBenchMarkPCS ? 'high' : 'low'
            setProcurementCostSavingsCard({ cardValue: averagePCS, benchmark: benchMarkPCS })
            //console.log('OrderFillRateForecastCard', OrderFillRateForecastCard);


            //----------------Transportation Cost of Revenue --------------
            const filteredTCOR = filterByDate(TransportationCostofRevenueData, formattedDataDate)
            const averageTCOR = calculateAverage(filteredTCOR, 'Transportation_Cost_as_a_Percentage_of_Revenue')
            //setTransportationCostofRevenueCard(averageTCOR)
            const filteredBenchMarkTCOR = filterBenchMarkData(benchMarkData, 'Transportation_Cost_as_a_Percentage_of_Revenue')
            const benchMarkTCOR = averageTCOR >= filteredBenchMarkTCOR ? 'high' : 'low'
            setTransportationCostofRevenueCard({ cardValue: averageTCOR, benchmark: benchMarkTCOR })

            //--------------------Product Return Rate by Year ----------------------------
            const filteredPRRY = filterByDate(productReturnRateData, selectedDate)
            const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
            // console.log("productReturnRatebyYearResult", productReturnRatebyYearResult);
            setProductReturnRateByYear({
                ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
                MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
            })

        } catch (error) {
            console.error('Error fetching data for the selected date:', error.message);
        }
        flagSet();
    };

    const handleClientChange = async (event) => {
        const selectedValue = event
        setSelectedClient(event);


        if (selectedValue === "All" && selectedDate) {
            // console.log('all client chossen');
            // ************************Sales****************

            //------------------------------Total_Sales_Revenue_Forecast--------------------
            const filteredTC = filterByDate(totalSalesRevenueData, selectedDate)
            const persentageQS = calculateAveragePercentage(filteredTC, 'Total_Sales_Revenue')
            const filteredBenchMarlTSRF = filterBenchMarkData(benchMarkData, 'Total_Sales_Revenue_Forecast')
            const benchMarkTC = persentageQS >= filteredBenchMarlTSRF ? 'high' : 'low'
            settotalSalesRevenueCard({ cardValue: persentageQS, benchmark: benchMarkTC })

            //------------------------------Calculate_Total_NumberOfCustomers_Forecast----------------------
            const filteredTNF = filterByDate(calculateTotalNumberOfCustomersForecastData, selectedDate)
            const persentageTNF = calculateAveragePercentage(filteredTNF, 'NumberOfCustomers')
            const filteredBenchMarkTNF = filterBenchMarkData(benchMarkData, 'Calculate_Total_NumberOfCustomers_Forecast')
            const benchMarkTNF = persentageTNF >= filteredBenchMarkTNF ? 'high' : 'low'
            setcalculateTotalNumberOfCustomersForecastCard({ cardValue: persentageTNF, benchmark: benchMarkTNF })

            //   //------------------------------Total_Sales_Volume_Quantity_Forecast----------------------
            const filteredVQF = filterByDate(totalSalesVolumeQuantityForecastData, selectedDate)
            const persentageVQF = calculateGroupByAverage(filteredVQF, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            settotalSalesVQF({
                MATKL_Material_Category: persentageVQF.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: persentageVQF.Total_Sales_Volume_Quantity
            })

            //------------------------------Sales by Region ----------------------
            const filteredSR = filterByDate(totalSalesbyRegionData, selectedDate)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })

            // ***************billing**************
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

            //-------------------------Days of Sales Outstanding---------------------------
            const filteredDSO = filterByDate(dsoData, selectedDate)
            const averageDSO = calculateAverage(filteredDSO, 'DSO')
            const filteredBenchMarkdso = filterBenchMarkData(benchMarkData, 'Build_Values_Forecast')
            const benchMarkDSO = averageDSO >= filteredBenchMarkdso ? 'high' : 'low'
            setDsoCard({ cardValue: averageDSO, benchmark: benchMarkDSO })

            //-------------------------Operating Profit---------------------------------------

            const filteredOP = filterByDate(operatingData, selectedDate)
            const averageOP = calculateAverage(filteredOP, 'GrossProfit')
            // console.log('averageOP',averageOP);
            const filteredBenchMarkOP = filterBenchMarkData(benchMarkData, 'CalculateOperating_Profit')
            const benchMarkOP = averageOP >= filteredBenchMarkOP ? 'high' : 'low'
            setOperatingCard({ cardValue: averageOP, benchmark: benchMarkOP })


            // **********for collection********************

            //-------------------------Cash To Cash Cycle Time---------------------------
            const filteredCTCCT = filterByDate(CashToCashCycleTimeData, selectedDate)
            const AverageCTCCT = calculateAverage(filteredCTCCT, 'CashToCashCycleTime')
            //setAverageCashToCashCycleTimeCard(AverageCTCCT)
            const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
            const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
            setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })
            //console.log('AverageCashToCashCycleTimeCard', AverageCashToCashCycleTimeCard);



            //------------Order To Cash Cycle Time --------------
            const filteredOTCCT = filterByDate(OrderToCashCycleTimeData, selectedDate)
            const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
            //setOrderToCashCycleTimeCard(averageOTCCT)
            const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
            const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
            setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
            //console.log('OrderToCashCycleTimeCard', OrderToCashCycleTimeCard);


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
            // console.log('else if')
            // **********************************SALES**********************

            //------------------------------Total_Sales_Revenue_Forecast--------------------
            const filteredTC = filterByDateCustomerProductN(totalSalesRevenueData, selectedDate, selectedValue, selectedProduct)
            const persentageQS = calculateAveragePercentage(filteredTC, 'Total_Sales_Revenue')
            const filteredBenchMarlTSRF = filterBenchMarkData(benchMarkData, 'Total_Sales_Revenue_Forecast')
            const benchMarkTC = persentageQS >= filteredBenchMarlTSRF ? 'high' : 'low'
            settotalSalesRevenueCard({ cardValue: persentageQS, benchmark: benchMarkTC })

            //------------------------------Calculate_Total_NumberOfCustomers_Forecast----------------------
            const filteredTNF = filterByDateCustomerProductN(calculateTotalNumberOfCustomersForecastData, selectedDate, selectedValue, selectedProduct)
            const persentageTNF = calculateAveragePercentage(filteredTNF, 'NumberOfCustomers')
            const filteredBenchMarkTNF = filterBenchMarkData(benchMarkData, 'Calculate_Total_NumberOfCustomers_Forecast')
            const benchMarkTNF = persentageTNF >= filteredBenchMarkTNF ? 'high' : 'low'
            setcalculateTotalNumberOfCustomersForecastCard({ cardValue: persentageTNF, benchmark: benchMarkTNF })

            //   //------------------------------Total_Sales_Volume_Quantity_Forecast----------------------
            const filteredVQF = filterByDateCustomerProductN(totalSalesVolumeQuantityForecastData, selectedDate, selectedValue, selectedProduct)
            const persentageVQF = calculateGroupByAverage(filteredVQF, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            settotalSalesVQF({
                MATKL_Material_Category: persentageVQF.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: persentageVQF.Total_Sales_Volume_Quantity
            })

            //------------------------------Sales by Region ----------------------
            const filteredSR = filterByDateCustomerProductN(totalSalesbyRegionData, selectedDate, selectedValue, selectedProduct)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })


            // ********************Billing******************
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

            //-------------------------Days of Sales Outstanding---------------------------
            const filteredDSO = filterByDateCustomerProductALT(dsoData, selectedDate, selectedValue, selectedProduct)
            const averageDSO = calculateAverage(filteredDSO, 'DSO')
            const filteredBenchMarkdso = filterBenchMarkData(benchMarkData, 'Build_Values_Forecast')
            const benchMarkDSO = averageDSO >= filteredBenchMarkdso ? 'high' : 'low'
            setDsoCard({ cardValue: averageDSO, benchmark: benchMarkDSO })

            //-------------------------Operating Profit---------------------------------------
            const filteredOP = filterByDateClientProduct(operatingData, selectedDate, selectedValue, selectedProduct)
            const averageOP = calculateAverage(filteredOP, 'GrossProfit')
            const filteredBenchMarkOP = filterBenchMarkData(benchMarkData, 'CalculateOperating_Profit')
            // console.log('filteredBenchMarkOP', filteredBenchMarkOP);
            const benchMarkOP = averageOP >= filteredBenchMarkOP ? 'high' : 'low'
            setOperatingCard({ cardValue: averageOP, benchmark: benchMarkOP })


            // ********for collection***********

            //-------------------------Cash To Cash Cycle Time---------------------------
            const filteredCTCCT = filterByDateCustomerProductALT(CashToCashCycleTimeData, selectedDate, selectedValue, selectedProduct)
            const AverageCTCCT = calculateAverage(filteredCTCCT, 'CashToCashCycleTime')
            //setAverageCashToCashCycleTimeCard(AverageCTCCT)
            const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
            const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
            setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })
            //console.log('AverageCashToCashCycleTimeCard', AverageCashToCashCycleTimeCard);

            //------------Order To Cash Cycle Time --------------
            const filteredOTCCT = filterByDateCustomerProduct(OrderToCashCycleTimeData, selectedDate, selectedValue, selectedProduct)
            const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
            //setOrderToCashCycleTimeCard(averageOTCCT)
            const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
            const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
            setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
            //console.log('OrderToCashCycleTimeCard', OrderToCashCycleTimeCard);


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
            // console.log('else part')

            // ***********************Sales***************
            //------------------------------Total_Sales_Revenue_Forecast--------------------
            const filteredTC = filterByDateAndCustomerN(totalSalesRevenueData, selectedDate, selectedValue)
            const persentageQS = calculateAveragePercentage(filteredTC, 'Total_Sales_Revenue')
            const filteredBenchMarlTSRF = filterBenchMarkData(benchMarkData, 'Total_Sales_Revenue_Forecast')
            // console.log('filteredBenchMarlTSRF',filteredBenchMarlTSRF);
            const benchMarkTC = persentageQS >= filteredBenchMarlTSRF ? 'high' : 'low'
            settotalSalesRevenueCard({ cardValue: persentageQS, benchmark: benchMarkTC })

            //------------------------------Calculate_Total_NumberOfCustomers_Forecast----------------------
            const filteredTNF = filterByDateAndCustomerN(calculateTotalNumberOfCustomersForecastData, selectedDate, selectedValue)
            const persentageTNF = calculateAveragePercentage(filteredTNF, 'NumberOfCustomers')
            const filteredBenchMarkTNF = filterBenchMarkData(benchMarkData, 'Calculate_Total_NumberOfCustomers_Forecast')
            const benchMarkTNF = persentageTNF >= filteredBenchMarkTNF ? 'high' : 'low'
            setcalculateTotalNumberOfCustomersForecastCard({ cardValue: persentageTNF, benchmark: benchMarkTNF })

            //   //------------------------------Total_Sales_Volume_Quantity_Forecast----------------------
            const filteredVQF = filterByDateAndCustomerN(totalSalesVolumeQuantityForecastData, selectedDate, selectedValue)
            const persentageVQF = calculateGroupByAverage(filteredVQF, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            settotalSalesVQF({
                MATKL_Material_Category: persentageVQF.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: persentageVQF.Total_Sales_Volume_Quantity
            })

            //------------------------------Sales by Region ----------------------
            const filteredSR = filterByDateAndCustomerN(totalSalesbyRegionData, selectedDate, selectedValue)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })


            // ************Biling******************
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

            //-------------------------Days of Sales Outstanding---------------------------
            const filteredDSO = filterByDateAndCustomerALT(dsoData, selectedDate, selectedValue)
            const averageDSO = calculateAverage(filteredDSO, 'DSO')
            const filteredBenchMarkdso = filterBenchMarkData(benchMarkData, 'Build_Values_Forecast')
            // console.log('averageDSO', averageDSO)
            const benchMarkDSO = averageDSO >= filteredBenchMarkdso ? 'high' : 'low'
            setDsoCard({ cardValue: averageDSO, benchmark: benchMarkDSO })

            //-------------------------Operating Profit---------------------------------------

            const filteredOP = filterByDateAndCustomerOPT(operatingData, selectedDate, selectedValue)
            const averageOP = calculateAverage(filteredOP, 'GrossProfit')
            console.log('averageOP', averageOP);
            const filteredBenchMarkOP = filterBenchMarkData(benchMarkData, 'CalculateOperating_Profit')
            // console.log('filteredBenchMarkOP',filteredBenchMarkOP);
            const benchMarkOP = averageOP >= filteredBenchMarkOP ? 'high' : 'low'
            setOperatingCard({ cardValue: averageOP, benchmark: benchMarkOP })


            // // // ****************************for collecton****************************
            //-------------------------Cash To Cash Cycle Time---------------------------
            const filteredCTCCT = filterByDateAndCustomerALT(CashToCashCycleTimeData, selectedDate, selectedValue)
            const AverageCTCCT = calculateAverage(filteredCTCCT, 'CashToCashCycleTime')
            //setAverageCashToCashCycleTimeCard(AverageCTCCT)
            const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
            const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
            setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })
            // console.log('AverageCashToCashCycleTimeCard', AverageCTCCT);


            // ------------Order To Cash Cycle Time --------------
            const filteredOTCCT = filterByDateAndCustomer(OrderToCashCycleTimeData, selectedDate, selectedValue)
            const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
            //setOrderToCashCycleTimeCard(averageOTCCT)
            const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
            const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
            setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
            // console.log('OrderToCashCycleTimeCard', averageOTCCT);



            //--------------Procurement Cost Savings --------------
            const filteredPCS = filterByDateAndCustomerALT(ProcurementCostSavingsData, selectedDate, selectedValue)
            const averagePCS = calculateAverage(filteredPCS, 'Procurement_Cost_Savings')
            //setProcurementCostSavingsCard(averagePCS)
            const filteredBenchMarkPCS = filterBenchMarkData(benchMarkData, 'Procurement_Cost_Savings')
            const benchMarkPCS = averagePCS >= filteredBenchMarkPCS ? 'high' : 'low'
            setProcurementCostSavingsCard({ cardValue: averagePCS, benchmark: benchMarkPCS })
            // console.log('OrderFillRateForecastCard', averagePCS);

            //----------------Transportation Cost of Revenue --------------
            const filteredTCOR = filterByDateAndCustomerN(TransportationCostofRevenueData, selectedDate, selectedValue)
            const averageTCOR = calculateAverage(filteredTCOR, 'Transportation_Cost_as_a_Percentage_of_Revenue')
            //setTransportationCostofRevenueCard(averageTCOR)
            const filteredBenchMarkTCOR = filterBenchMarkData(benchMarkData, 'Transportation_Cost_as_a_Percentage_of_Revenue')
            const benchMarkTCOR = averageTCOR >= filteredBenchMarkTCOR ? 'high' : 'low'
            setTransportationCostofRevenueCard({ cardValue: averageTCOR, benchmark: benchMarkTCOR })
            // console.log('TransportationCostofRevenueCard', averageTCOR);

            //--------------------Product Return Rate by Year ----------------------------
            const filteredPRRY = filterByDateAndCustomer(productReturnRateData, selectedDate, selectedValue)
            const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'customer_name', 'ProductReturnRate');
            setProductReturnRateByYear({
                ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
                MTEXT_ClientName: productReturnRatebyYearResult.customer_name
            })
            // console.log('productReturnRatebyYearResult', productReturnRatebyYearResult);
        }
        flagSet();
    };


    const handleRegionChange = (event) => {
        const selectedValue = event;
        setSelectedRegion(event);

        if (selectedValue === "All" && selectedDate) {
            // console.log('work all');
            // *************************************Sales****************************************
            //------------------------------Total_Sales_Revenue_Forecast--------------------
            const filteredTC = filterByDate(totalSalesRevenueData, selectedDate)
            const persentageQS = calculateAverage(filteredTC, 'Total_Sales_Revenue')
            const filteredBenchMarTSRF = filterBenchMarkData(benchMarkData, 'Total_Sales_Revenue_Forecast')
            const benchMarkTC = persentageQS >= filteredBenchMarTSRF ? 'high' : 'low'
            settotalSalesRevenueCard({ cardValue: persentageQS, benchmark: benchMarkTC })



            //------------------------------Calculate_Total_NumberOfCustomers_Forecast----------------------
            const filteredQS1 = filterByDate(calculateTotalNumberOfCustomersForecastData, selectedDate)
            const persentageQS1 = calculateAverage(filteredQS1, 'NumberOfCustomers')
            const filteredBenchMarkTNF = filterBenchMarkData(benchMarkData, 'Calculate_Total_NumberOfCustomers_Forecast')
            const benchMarkTNF = persentageQS1 >= filteredBenchMarkTNF ? 'high' : 'low'
            setcalculateTotalNumberOfCustomersForecastCard({ cardValue: persentageQS1, benchmark: benchMarkTNF })

            //   //------------------------------Total_Sales_Volume_Quantity_Forecast----------------------
            const filteredSR2 = filterByDate(totalSalesVolumeQuantityForecastData, selectedDate)
            const totalSalesVolumeQuantityForecastResult = calculateGroupByAverage(filteredSR2, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            settotalSalesVQF({
                MATKL_Material_Category: totalSalesVolumeQuantityForecastResult.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: totalSalesVolumeQuantityForecastResult.Total_Sales_Volume_Quantity
            })

            //------------------------------Sales by Region ----------------------
            const filteredSR = filterByDate(totalSalesbyRegionData, selectedDate)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })

        }

        else if (selectedProduct !== "" && selectedValue !== 'All') {

            //------------------------------Total_Sales_Revenue_Forecast--------------------
            const filteredTC = filterByDateRegionProduct(totalSalesRevenueData, selectedDate, selectedValue, selectedProduct)
            const persentageQS = calculateAverage(filteredTC, 'Total_Sales_Revenue')
            const filteredBenchMarTSRF = filterBenchMarkData(benchMarkData, 'Total_Sales_Revenue_Forecast')
            const benchMarkTC = persentageQS >= filteredBenchMarTSRF ? 'high' : 'low'
            settotalSalesRevenueCard({ cardValue: persentageQS, benchmark: benchMarkTC })

            //------------------------------Calculate_Total_NumberOfCustomers_Forecast----------------------
            const filteredQS2 = filterByDateRegionProduct(calculateTotalNumberOfCustomersForecastData, selectedDate, selectedProduct)
            const persentage2 = calculateAverage(filteredQS2, 'NumberOfCustomers')
            const filteredBenchMarkTNF = filterBenchMarkData(benchMarkData, 'Calculate_Total_NumberOfCustomers_Forecast')
            const benchMarkTNF = persentage2 >= filteredBenchMarkTNF ? 'high' : 'low'
            setcalculateTotalNumberOfCustomersForecastCard({ cardValue: persentage2, benchmark: benchMarkTNF })

            //   //------------------------------Total_Sales_Volume_Quantity_Forecast----------------------
            const filteredSR2 = filterByDateRegionProduct(totalSalesVolumeQuantityForecastData, selectedDate, selectedValue, selectedProduct)
            const totalSalesVolumeQuantityForecastResult = calculateGroupByAverage(filteredSR2, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            settotalSalesVQF({
                MATKL_Material_Category: totalSalesVolumeQuantityForecastResult.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: totalSalesVolumeQuantityForecastResult.Total_Sales_Volume_Quantity
            })

            //------------------------------Sales by Region ----------------------
            const filteredSR = filterByDateRegionProduct(totalSalesbyRegionData, selectedDate, selectedValue, selectedProduct)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })

        } else {
            //------------------------------Total_Sales_Revenue_Forecast--------------------
            const filteredTC = filterByDateRegion(totalSalesRevenueData, selectedDate, selectedValue)
            const persentageQS = calculateAverage(filteredTC, 'Total_Sales_Revenue')
            const filteredBenchMarTSRF = filterBenchMarkData(benchMarkData, 'Total_Sales_Revenue_Forecast')
            const benchMarkTC = persentageQS >= filteredBenchMarTSRF ? 'high' : 'low'
            settotalSalesRevenueCard({ cardValue: persentageQS, benchmark: benchMarkTC })

            // console.log('data', persentageQS);
            //------------------------------Calculate_Total_NumberOfCustomers_Forecast----------------------
            const filteredQS1 = filterByDateRegion(calculateTotalNumberOfCustomersForecastData, selectedDate, selectedValue)
            const persentageQS1 = calculateAverage(filteredQS1, 'NumberOfCustomers')
            const filteredBenchMarkTNF = filterBenchMarkData(benchMarkData, 'Calculate_Total_NumberOfCustomers_Forecast')
            const benchMarkTNF = persentageQS1 >= filteredBenchMarkTNF ? 'high' : 'low'
            setcalculateTotalNumberOfCustomersForecastCard({ cardValue: persentageQS1, benchmark: benchMarkTNF })
            //------------------------------Sales by Region ----------------------
            const filteredSR = filterByDateRegion(totalSalesbyRegionData, selectedDate, selectedValue)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })
            //------------------------------Total_Sales_Volume_Quantity_Forecast----------------------
            const filteredSR2 = filterByDateRegion(totalSalesVolumeQuantityForecastData, selectedDate, selectedValue)
            const totalSalesVolumeQuantityForecastResult = calculateGroupByAverage(filteredSR2, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            settotalSalesVQF({
                MATKL_Material_Category: totalSalesVolumeQuantityForecastResult.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: totalSalesVolumeQuantityForecastResult.Total_Sales_Volume_Quantity
            })

        }
        flagSet();
    };

    const handleSalesmanChange = (event) => {
        const selectedValue = event;
        // console.log('event',event)
        setselectedSalesman(selectedValue);
        // console.log('selectedValue',selectedValue)
        if (selectedValue === "All" && selectedProduct !== 'All' && selectedRegion !== 'All' && selectedClient !== 'All') {
            console.log('all value');


            // //------------------------------Total_Sales_Volume_Quantity_Forecast----------------------
            const filteredSR2 = filterByDateRouteDealerProduct(totalSalesVolumeQuantityForecastData, selectedDate, selectedRegion, selectedClient, selectedProduct)
            // console.log('filter sales 3',filteredSR2);
            const totalSalesVolumeQuantityForecastResult = calculateGroupByAverage(filteredSR2, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            // console.log('filter sales 4',totalSalesVolumeQuantityForecastResult);
            settotalSalesVQF({
                MATKL_Material_Category: totalSalesVolumeQuantityForecastResult.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: totalSalesVolumeQuantityForecastResult.Total_Sales_Volume_Quantity
            })



            // //----------------------------- Total Sales by Region----
            const filteredSR = filterByDateRouteDealerProduct(totalSalesbyRegionData, selectedDate, selectedRegion, selectedClient, selectedProduct)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');
            // console.log('if totalSalesByRegiontResult', totalSalesByRegiontResult)
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })





            //-------Total Amount Invoiced per Customer

            const filteredIPP = lowerfilterByDateRouteDealerProduct(amountInvPerPlantData, selectedDate, selectedRegion, selectedClient, selectedProduct)
            // console.log('if amountInvPerPlantResult', filteredIPP)
            const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
            // console.log('if amountInvPerPlantResult', amountInvPerPlantResult)
            setAmountInvPerPlant({
                Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
                customer_name: amountInvPerPlantResult.customer_name
            });



            //-------------Invoice Processing Time per Customer-------------------
            const filteredIPT = lowerfilterByDateRouteDealerProduct(invoiceProcessingTimeData, selectedDate, selectedRegion, selectedClient, selectedProduct)
            //  console.log('if amountInvPerPlantResult', filteredIPT)
            const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
            //  console.log('if amountInvPerPlantResult', invoiceProcessingTimeResult)
            setInvoiceProcessingTime({
                DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
                Delivary_Date: invoiceProcessingTimeResult.customer_name
            })


            //--------------------Product Return Rate by Year ----------------------------
            const filteredPRRY = lowerfilterByDateRouteDealerProduct(productReturnRateData, selectedDate, selectedRegion, selectedClient, selectedProduct)
            // console.log('if productReturnRateData', filteredPRRY)
            const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
            // console.log('if productReturnRateData', productReturnRatebyYearResult)
            setProductReturnRateByYear({
                ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
                MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
            })




        }
        else if (selectedValue !== "All" && selectedProduct !== 'All' && selectedRegion !== 'All' && selectedClient !== 'All') {
            //------------------------------Total_Sales_Volume_Quantity_Forecast----------------------
            const filteredSR2 = filterByDateRouteDealerProductSales(totalSalesVolumeQuantityForecastData, selectedDate, selectedRegion, selectedClient, selectedProduct, selectedValue)
            // console.log('else if filter sales 2',filteredSR2);
            const totalSalesVolumeQuantityForecastResult = calculateGroupByAverage(filteredSR2, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            // console.log('filter sales 4',totalSalesVolumeQuantityForecastResult);
            settotalSalesVQF({
                MATKL_Material_Category: totalSalesVolumeQuantityForecastResult.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: totalSalesVolumeQuantityForecastResult.Total_Sales_Volume_Quantity
            })


            // //----------------------------- Total Sales by Region----
            const filteredSR = filterByDateRouteDealerProductSales(totalSalesbyRegionData, selectedDate, selectedRegion, selectedClient, selectedProduct, selectedValue)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');
            // console.log('1 st ese if totalSalesByRegiontResult', totalSalesByRegiontResult)
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })


            //-------Total Amount Invoiced per Customer

            const filteredIPP = lowerfilterByDateRouteDealerProductSales(amountInvPerPlantData, selectedDate, selectedRegion, selectedClient, selectedProduct, selectedValue)
            const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
            // console.log('1 st ese if totalSalesByRegiontResult', amountInvPerPlantResult)
            setAmountInvPerPlant({
                Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
                customer_name: amountInvPerPlantResult.customer_name
            });




            //-------------Invoice Processing Time per Customer-------------------
            const filteredIPT = lowerfilterByDateRouteDealerProductSales(invoiceProcessingTimeData, selectedDate, selectedRegion, selectedClient, selectedProduct, selectedValue)
            //  console.log('1 st else if invoiceProcessingTimeData', filteredIPT)
            const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
            //  console.log('1 st else if invoiceProcessingTimeData', invoiceProcessingTimeResult)
            setInvoiceProcessingTime({
                DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
                Delivary_Date: invoiceProcessingTimeResult.customer_name
            })

            //--------------------Product Return Rate by Year ----------------------------
            const filteredPRRY = lowerfilterByDateRouteDealerProductSales(productReturnRateData, selectedDate, selectedRegion, selectedClient, selectedProduct, selectedValue)
            // console.log('1 st else if productReturnRateData', filteredPRRY)
            const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
            // console.log('1 st else if productReturnRateData', productReturnRatebyYearResult)
            setProductReturnRateByYear({
                ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
                MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
            })
        }
        else if (selectedValue !== "All" && selectedProduct === 'All' && selectedRegion !== 'All' && selectedClient !== 'All') {


            const filteredSR2 = filterByDateRouteDealerSales(totalSalesVolumeQuantityForecastData, selectedDate, selectedRegion, selectedClient, selectedValue)
            // console.log('else if filter sales 3',filteredSR2);
            const totalSalesVolumeQuantityForecastResult = calculateGroupByAverage(filteredSR2, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            // console.log('filter sales 4',totalSalesVolumeQuantityForecastResult);
            settotalSalesVQF({
                MATKL_Material_Category: totalSalesVolumeQuantityForecastResult.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: totalSalesVolumeQuantityForecastResult.Total_Sales_Volume_Quantity
            })


            // //----------------------------- Total Sales by Region----
            const filteredSR = filterByDateRouteDealerSales(totalSalesbyRegionData, selectedDate, selectedRegion, selectedClient, selectedValue)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');

            // console.log('1 st ese if totalSalesByRegiontResult', totalSalesByRegiontResult)
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })




            //-------Total Amount Invoiced per Customer

            const filteredIPP = lowerfilterByDateRouteDealerSales(amountInvPerPlantData, selectedDate, selectedRegion, selectedClient, selectedValue)
            // console.log('2nd  totalSalesByRegiontResult', filteredIPP)
            const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
            // console.log('2nd ese if totalSalesByRegiontResult', amountInvPerPlantResult)
            setAmountInvPerPlant({
                Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
                customer_name: amountInvPerPlantResult.customer_name
            });



            //-------------Invoice Processing Time per Customer-------------------
            const filteredIPT = lowerfilterByDateRouteDealerSales(invoiceProcessingTimeData, selectedDate, selectedRegion, selectedClient, selectedValue)
            //  console.log('2nd  invoiceProcessingTimeData', filteredIPT)
            const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
            //  console.log('2nd  invoiceProcessingTimeData', invoiceProcessingTimeResult)
            setInvoiceProcessingTime({
                DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
                Delivary_Date: invoiceProcessingTimeResult.customer_name
            })

            //--------------------Product Return Rate by Year ----------------------------
            const filteredPRRY = lowerfilterByDateRouteDealerSales(productReturnRateData, selectedDate, selectedRegion, selectedClient, selectedValue)
            // console.log('2nd  productReturnRateData', filteredPRRY)
            const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
            // console.log('2nd  productReturnRateData', productReturnRatebyYearResult)
            setProductReturnRateByYear({
                ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
                MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
            })

        }

        else if (selectedValue !== "All" && selectedProduct !== 'All' && selectedRegion === 'All' && selectedClient !== 'All') {
            // console.log('4 nd else value'); 
            const filteredSR2 = filterByDateDealerProductSales(totalSalesVolumeQuantityForecastData, selectedDate, selectedClient, selectedProduct, selectedValue)
            // console.log('else if filter sales 4',filteredSR2);
            const totalSalesVolumeQuantityForecastResult = calculateGroupByAverage(filteredSR2, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            // console.log('filter sales 4',totalSalesVolumeQuantityForecastResult);
            settotalSalesVQF({
                MATKL_Material_Category: totalSalesVolumeQuantityForecastResult.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: totalSalesVolumeQuantityForecastResult.Total_Sales_Volume_Quantity
            })




            // //----------------------------- Total Sales by Region----
            const filteredSR = filterByDateDealerProductSales(totalSalesbyRegionData, selectedDate, selectedClient, selectedProduct, selectedValue)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');

            // console.log('3rd st ese if totalSalesByRegiontResult', totalSalesByRegiontResult)
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })




            //-------Total Amount Invoiced per Customer

            const filteredIPP = lowerfilterByDateDealerProductSales(amountInvPerPlantData, selectedDate, selectedClient, selectedProduct, selectedValue)
            const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
            console.log('3rd ese if totalSalesByRegiontResult', amountInvPerPlantResult)
            setAmountInvPerPlant({
                Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
                customer_name: amountInvPerPlantResult.customer_name
            });




            //-------------Invoice Processing Time per Customer-------------------
            const filteredIPT = lowerfilterByDateDealerProductSales(invoiceProcessingTimeData, selectedDate, selectedClient, selectedProduct, selectedValue)
            //  console.log('3rd ese if invoiceProcessingTimeData', filteredIPT)
            const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
            //  console.log('3rd ese if invoiceProcessingTimeData', invoiceProcessingTimeResult)
            setInvoiceProcessingTime({
                DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
                Delivary_Date: invoiceProcessingTimeResult.customer_name
            })

            //--------------------Product Return Rate by Year ----------------------------
            const filteredPRRY = lowerfilterByDateDealerProductSales(productReturnRateData, selectedDate, selectedRegion, selectedClient, selectedValue)
            // console.log('3rd else if invoiceProcessingTimeData', filteredPRRY)
            const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
            // console.log('3rd else if invoiceProcessingTimeData', productReturnRatebyYearResult)
            setProductReturnRateByYear({
                ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
                MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
            })








        }

        else if (selectedValue !== "All" && selectedProduct !== 'All' && selectedRegion !== 'All' && selectedClient === 'All') {
            // console.log('5 nd else value'); 
            const filteredSR2 = filterByDateRouteDProductsales(totalSalesVolumeQuantityForecastData, selectedDate, selectedRegion, selectedProduct, selectedValue)
            // console.log('else if filter sales 5',filteredSR2);
            const totalSalesVolumeQuantityForecastResult = calculateGroupByAverage(filteredSR2, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            // console.log('filter sales 4',totalSalesVolumeQuantityForecastResult);
            settotalSalesVQF({
                MATKL_Material_Category: totalSalesVolumeQuantityForecastResult.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: totalSalesVolumeQuantityForecastResult.Total_Sales_Volume_Quantity
            })


            // //----------------------------- Total Sales by Region----
            const filteredSR = filterByDateRouteDProductsales(totalSalesbyRegionData, selectedDate, selectedRegion, selectedProduct, selectedValue)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');

            // console.log('4th st ese if totalSalesByRegiontResult', totalSalesByRegiontResult)
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })



            //-------Total Amount Invoiced per Customer

            const filteredIPP = lowerfilterByDateRouteDProductsales(amountInvPerPlantData, selectedDate, selectedRegion, selectedProduct, selectedValue)
            const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
            console.log('4th ese if totalSalesByRegiontResult', amountInvPerPlantResult)
            setAmountInvPerPlant({
                Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
                customer_name: amountInvPerPlantResult.customer_name
            });



            //-------------Invoice Processing Time per Customer-------------------
            const filteredIPT = lowerfilterByDateRouteDProductsales(invoiceProcessingTimeData, selectedDate, selectedRegion, selectedProduct, selectedValue)
            //  console.log('4th ese if invoiceProcessingTimeData', filteredIPT)
            const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
            //  console.log('4th ese if invoiceProcessingTimeData', invoiceProcessingTimeResult)
            setInvoiceProcessingTime({
                DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
                Delivary_Date: invoiceProcessingTimeResult.customer_name
            })


            //--------------------Product Return Rate by Year ----------------------------
            const filteredPRRY = lowerfilterByDateRouteDProductsales(productReturnRateData, selectedDate, selectedRegion, selectedProduct, selectedValue)
            console.log('4th ese if productReturnRateData', filteredIPT)
            const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
            console.log('4th ese if productReturnRateData', productReturnRatebyYearResult)
            setProductReturnRateByYear({
                ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
                MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
            })







        }

    }


    const productChange = async (event) => {
        const selectedValue = event
        setSelectedProduct(event);


        if (selectedValue === "All") {
            //-------------LPR-------------------
            const filteredLPR = filterByDateAndCustomer(latePaymentRateData, selectedDate, selectedClient)
            const persentageLPR = calculateAveragePercentage(filteredLPR, 'LatePaymentRate')
            //setLatePaymentRateCard(persentageLPR)
            const filteredBenchMark = filterBenchMarkData(benchMarkData, 'LatePaymentRate_Forecast')
            const benchMark = persentageLPR >= filteredBenchMark ? 'high' : 'low'
            setLatePaymentRateCard({ cardValue: persentageLPR, benchmark: benchMark })
            //console.log('OrderFulfillmentAccuracyCard', OrderFulfillmentAccuracyCard);
            //-------------IPT-------------------
            const filteredIPT = filterByDateAndCustomer(invoiceProcessingTimeData, selectedDate, selectedClient)
            const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
            setInvoiceProcessingTime({
                DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
                Delivary_Date: invoiceProcessingTimeResult.customer_name
            })

            //-------------IPP-------------------
            const filteredIPP = filterByDateAndCustomer(amountInvPerPlantData, selectedDate, selectedClient)
            const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
            setAmountInvPerPlant({
                Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
                customer_name: amountInvPerPlantResult.customer_name
            });

            //-------------TIA-------------------
            const filteredTIA = filterByDateAndCustomer(companywiseTotalInvoiceAmountData, selectedDate, selectedClient)
            setCompanywiseTotalInvoiceAmountFilter(filteredTIA)

            //-------------Billed Value---------------
            const filteredBV = filterByDateAndCustomer(billedValueData, selectedDate, selectedClient, selectedProduct)
            const avarageBV = calculateAverage(filteredBV, 'OrderValue')
            setBilledValueCard({ cardValue: avarageBV, benchmark: 'high' })
            const avarageBVChart = calculateGroupByAverage(filteredBV, 'MATKL_Material_Category', 'OrderValue');
            setBilledValueChart({
                product_cat: avarageBVChart.MATKL_Material_Category,
                order_value: avarageBVChart.OrderValue
            });


            //-------------------------Days of Sales Outstanding---------------------------
            const filteredDSO = filterByDateAndCustomer(dsoData, selectedDate, selectedClient)
            const averageDSO = calculateAverage(filteredDSO, 'DSO')
            const filteredBenchMarkdso = filterBenchMarkData(benchMarkData, 'Build_Values_Forecast')
            const benchMarkDSO = averageDSO >= filteredBenchMarkdso ? 'high' : 'low'
            setDsoCard({ cardValue: averageDSO, benchmark: benchMarkDSO })

            // //-------------------------Operating Profit---------------------------------------
            // const filteredOP = filterByDateCustomerProductALT(operatingData, selectedDate, selectedClient, selectedProduct)
            // const averageOP = calculateAverage(filteredOP, 'GrossProfit')
            // const filteredBenchMarkOP = filterBenchMarkData(benchMarkData, 'CalculateOperating_Profit')
            // const benchMarkOP = averageOP >= filteredBenchMarkOP ? 'high' : 'low'
            // setOperatingCard({ cardValue: averageOP, benchmark: benchMarkOP })


            // ********************************product change for collection************************************************

            //-------------------------Cash To Cash Cycle Time---------------------------
            const filteredCTCCT = filterByDateAndCustomer(CashToCashCycleTimeData, selectedDate, selectedClient)
            const AverageCTCCT = calculateAverage(filteredCTCCT, 'CashToCashCycleTime')
            // setAverageCashToCashCycleTimeCard(AverageCTCCT)
            const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
            const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
            setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })
            //console.log('AverageCashToCashCycleTimeCard', AverageCashToCashCycleTimeCard);

            //------------Order To Cash Cycle Time --------------
            const filteredOTCCT = filterByDateAndCustomer(OrderToCashCycleTimeData, selectedDate, selectedClient)
            const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
            //setOrderToCashCycleTimeCard(averageOTCCT)
            const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
            const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
            setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
            //console.log('OrderToCashCycleTimeCard', OrderToCashCycleTimeCard);


            //--------------Procurement Cost Savings --------------
            const filteredPCS = filterByDateAndCustomer(ProcurementCostSavingsData, selectedDate, selectedClient)
            const averagePCS = calculateAverage(filteredPCS, 'Procurement_Cost_Savings')
            //setProcurementCostSavingsCard(averagePCS)
            const filteredBenchMarkPCS = filterBenchMarkData(benchMarkData, 'Procurement_Cost_Savings')
            const benchMarkPCS = averagePCS >= filteredBenchMarkPCS ? 'high' : 'low'
            setProcurementCostSavingsCard({ cardValue: averagePCS, benchmark: benchMarkPCS })
            //console.log('OrderFillRateForecastCard', OrderFillRateForecastCard);


            //----------------Transportation Cost of Revenue --------------
            const filteredTCOR = filterByDateAndCustomer(TransportationCostofRevenueData, selectedDate, selectedClient)
            const averageTCOR = calculateAverage(filteredTCOR, 'Transportation_Cost_as_a_Percentage_of_Revenue')
            //setTransportationCostofRevenueCard(averageTCOR)
            const filteredBenchMarkTCOR = filterBenchMarkData(benchMarkData, 'Transportation_Cost_as_a_Percentage_of_Revenue')
            const benchMarkTCOR = averageTCOR >= filteredBenchMarkTCOR ? 'high' : 'low'
            setTransportationCostofRevenueCard({ cardValue: averageTCOR, benchmark: benchMarkTCOR })
            //console.log('TransportationCostofRevenueCard', TransportationCostofRevenueCard);

            //--------------------Product Return Rate by Year ----------------------------
            const filteredPRRY = filterByDateAndCustomer(productReturnRateData, selectedDate, selectedClient)
            const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
            // console.log("productReturnRatebyYearResult", productReturnRatebyYearResult);
            setProductReturnRateByYear({
                ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
                MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
            })
        }

        else if (selectedClient !== "") {
            //-------------LPR-------------------
            const filteredLPR = filterByDateCustomerProduct(latePaymentRateData, selectedDate, selectedClient, selectedValue)
            const persentageLPR = calculateAveragePercentage(filteredLPR, 'LatePaymentRate')
            //setLatePaymentRateCard(persentageLPR)
            const filteredBenchMark = filterBenchMarkData(benchMarkData, 'LatePaymentRate_Forecast')
            const benchMark = persentageLPR >= filteredBenchMark ? 'high' : 'low'
            setLatePaymentRateCard({ cardValue: persentageLPR, benchmark: benchMark })
            //console.log('OrderFulfillmentAccuracyCard', OrderFulfillmentAccuracyCard);
            //-------------IPT-------------------
            const filteredIPT = filterByDateCustomerProduct(invoiceProcessingTimeData, selectedDate, selectedClient, selectedValue)
            const invoiceProcessingTimeResult = calculateGroupByAverage(filteredIPT, 'customer_name', 'DaysToComplete');
            setInvoiceProcessingTime({
                DaysToComplete: invoiceProcessingTimeResult.DaysToComplete,
                Delivary_Date: invoiceProcessingTimeResult.customer_name
            })

            //-------------IPP-------------------
            const filteredIPP = filterByDateCustomerProduct(amountInvPerPlantData, selectedDate, selectedClient, selectedValue)
            const amountInvPerPlantResult = calculateGroupByAverage(filteredIPP, 'customer_name', 'Total_Amount_Invoiced');
            setAmountInvPerPlant({
                Total_Amount_Invoiced: amountInvPerPlantResult.Total_Amount_Invoiced,
                customer_name: amountInvPerPlantResult.customer_name
            });

            //-------------TIA-------------------
            const filteredTIA = filterByDateCustomerProduct(companywiseTotalInvoiceAmountData, selectedDate, selectedClient, selectedValue)
            setCompanywiseTotalInvoiceAmountFilter(filteredTIA)

            //-------------Billed Value---------------
            const filteredBV = filterByDateCustomerProduct(billedValueData, selectedDate, selectedClient, selectedValue)
            const avarageBV = calculateAverage(filteredBV, 'OrderValue')
            setBilledValueCard({ cardValue: avarageBV, benchmark: 'high' })
            const avarageBVChart = calculateGroupByAverage(filteredBV, 'MATKL_Material_Category', 'OrderValue');
            setBilledValueChart({
                product_cat: avarageBVChart.MATKL_Material_Category,
                order_value: avarageBVChart.OrderValue
            });


            //-------------------------Days of Sales Outstanding---------------------------
            const filteredDSO = filterByDateCustomerProductALT(dsoData, selectedDate, selectedClient, selectedValue)
            const averageDSO = calculateAverage(filteredDSO, 'DSO')
            const filteredBenchMarkdso = filterBenchMarkData(benchMarkData, 'Build_Values_Forecast')
            const benchMarkDSO = averageDSO >= filteredBenchMarkdso ? 'high' : 'low'
            setDsoCard({ cardValue: averageDSO, benchmark: benchMarkDSO })

            // //-------------------------Operating Profit---------------------------------------
            // const filteredOP = filterByDateCustomerProductALT(operatingData, selectedDate, selectedClient, selectedProduct)
            // const averageOP = calculateAverage(filteredOP, 'GrossProfit')
            // const filteredBenchMarkOP = filterBenchMarkData(benchMarkData, 'CalculateOperating_Profit')
            // const benchMarkOP = averageOP >= filteredBenchMarkOP ? 'high' : 'low'
            // setOperatingCard({ cardValue: averageOP, benchmark: benchMarkOP })


            // ********************************product change for collection************************************************

            //-------------------------Cash To Cash Cycle Time---------------------------
            const filteredCTCCT = filterByDateCustomerProductALT(CashToCashCycleTimeData, selectedDate, selectedClient, selectedValue)
            const AverageCTCCT = calculateAverage(filteredCTCCT, 'CashToCashCycleTime')
            // setAverageCashToCashCycleTimeCard(AverageCTCCT)
            const filteredBenchMarkCTCCT = filterBenchMarkData(benchMarkData, 'CashToCashCycleTime')
            const benchMarkCTCCT = AverageCTCCT >= filteredBenchMarkCTCCT ? 'high' : 'low'
            setAverageCashToCashCycleTimeCard({ cardValue: AverageCTCCT, benchmark: benchMarkCTCCT })
            //console.log('AverageCashToCashCycleTimeCard', AverageCashToCashCycleTimeCard);

            //------------Order To Cash Cycle Time --------------
            const filteredOTCCT = filterByDateCustomerProduct(OrderToCashCycleTimeData, selectedDate, selectedClient, selectedValue)
            const averageOTCCT = calculateAverage(filteredOTCCT, 'OrderToCashCycleTime')
            //setOrderToCashCycleTimeCard(averageOTCCT)
            const filteredBenchMarkOTCCT = filterBenchMarkData(benchMarkData, 'OrderToCashCycleTime')
            const benchMarkOTCCT = averageOTCCT >= filteredBenchMarkOTCCT ? 'high' : 'low'
            setOrderToCashCycleTimeCard({ cardValue: averageOTCCT, benchmark: benchMarkOTCCT })
            //console.log('OrderToCashCycleTimeCard', OrderToCashCycleTimeCard);


            //--------------Procurement Cost Savings --------------
            const filteredPCS = filterByDateCustomerProductALT(ProcurementCostSavingsData, selectedDate, selectedClient, selectedValue)
            const averagePCS = calculateAverage(filteredPCS, 'Procurement_Cost_Savings')
            //setProcurementCostSavingsCard(averagePCS)
            const filteredBenchMarkPCS = filterBenchMarkData(benchMarkData, 'Procurement_Cost_Savings')
            const benchMarkPCS = averagePCS >= filteredBenchMarkPCS ? 'high' : 'low'
            setProcurementCostSavingsCard({ cardValue: averagePCS, benchmark: benchMarkPCS })
            //console.log('OrderFillRateForecastCard', OrderFillRateForecastCard);


            //----------------Transportation Cost of Revenue --------------
            const filteredTCOR = filterByDateCustomerProductN(TransportationCostofRevenueData, selectedDate, selectedClient, selectedValue)
            const averageTCOR = calculateAverage(filteredTCOR, 'Transportation_Cost_as_a_Percentage_of_Revenue')
            //setTransportationCostofRevenueCard(averageTCOR)
            const filteredBenchMarkTCOR = filterBenchMarkData(benchMarkData, 'Transportation_Cost_as_a_Percentage_of_Revenue')
            const benchMarkTCOR = averageTCOR >= filteredBenchMarkTCOR ? 'high' : 'low'
            setTransportationCostofRevenueCard({ cardValue: averageTCOR, benchmark: benchMarkTCOR })
            //console.log('TransportationCostofRevenueCard', TransportationCostofRevenueCard);

            //--------------------Product Return Rate by Year ----------------------------
            const filteredPRRY = filterByDateCustomerProduct(productReturnRateData, selectedDate, selectedClient, selectedValue)
            const productReturnRatebyYearResult = calculateGroupByAverage(filteredPRRY, 'MATKL_Material_Category', 'ProductReturnRate');
            // console.log("productReturnRatebyYearResult", productReturnRatebyYearResult);
            setProductReturnRateByYear({
                ProductReturnRate: productReturnRatebyYearResult.ProductReturnRate,
                MTEXT_ClientName: productReturnRatebyYearResult.MATKL_Material_Category
            })
        }
        else {
            // console.log('filter 1', selectedProduct);
            // console.log('click to product change');
            // ************************************For Sales***********************************************

            //------------------------------Total_Sales_Revenue_Forecast--------------------
            const filterdTSR = filterByDateCustomerProductN(totalSalesRevenueData, selectedDate, selectedClient, selectedValue)
            const persentageQS = calculateAverage(filterdTSR, 'Total_Sales_Revenue')
            const filteredBenchMarkSales = filterBenchMarkData(benchMarkData, 'Total_Sales_Revenue_Forecast')
            const benchMarkSales = persentageQS >= filteredBenchMarkSales ? 'high' : 'low'
            // console.log('persentageQS',persentageQS);
            settotalSalesRevenueCard({ cardValue: persentageQS, benchmark: benchMarkSales })


            //------------------------------Calculate_Total_NumberOfCustomers_Forecast----------------------
            const filteredTC = filterByDateCustomerProductN(calculateTotalNumberOfCustomersForecastData, selectedDate, selectedClient, selectedValue)
            const persentageNCustomer = calculateAverage(filteredTC, 'NumberOfCustomers')
            const filteredBenchMarkNCustomer = filterBenchMarkData(benchMarkData, 'Calculate_Total_NumberOfCustomers_Forecast')
            const benchMarkNCustomer = persentageNCustomer >= filteredBenchMarkNCustomer ? 'high' : 'low'
            setcalculateTotalNumberOfCustomersForecastCard({ cardValue: persentageNCustomer, benchmark: benchMarkNCustomer })

            //------------------------------Sales by Region ----------------------
            const filteredSR = filterByDateCustomerProductN(totalSalesbyRegionData, selectedDate, selectedClient, selectedValue)
            const totalSalesByRegiontResult = calculateGroupByAverage(filteredSR, 'REGION', 'Total_Sales_Volume_Quantity');
            settotalSalesSBR({
                REGION: totalSalesByRegiontResult.REGION,
                Total_Sales_Volume_Quantity: totalSalesByRegiontResult.Total_Sales_Volume_Quantity
            })

            //------------------------------Total_Sales_Volume_Quantity_Forecast----------------------
            const filteredTSBV = filterByDateProduct(totalSalesVolumeQuantityForecastData, selectedDate, selectedValue)
            console.log('product ', filteredTSBV);
            // const persentageQTSV = calculateAveragePercentage(filteredTSBV, 'Total_Sales_Volume_Quantity')
            const totalSalesVolumeQuantityForecastResult = calculateGroupByAverage(filteredTSBV, 'MATKL_Material_Category', 'Total_Sales_Volume_Quantity');
            settotalSalesVQF({
                MATKL_Material_Category: totalSalesVolumeQuantityForecastResult.MATKL_Material_Category,
                Total_Sales_Volume_Quantity: totalSalesVolumeQuantityForecastResult.Total_Sales_Volume_Quantity
            })

            // *************product change for billing***************

            const selectedProduct = selectedValue.target.value
            // console.log('selected value :', selectedProduct);

        }
        flagSet();
    };








    const flagSet = () => {
        if (totalSalesVQF.MATKL_Material_Category.length > 0) {
            settotalSalesVQFLoder(1)
        }
        else {
            settotalSalesVQFLoder(1)
        }
        if (totalSalesSBR.REGION.length > 0) {
            settotalSalesSBRLoder(1)
        }
        else {
            settotalSalesSBRLoder(1)
        }
        if (billedValueChart.order_value.length > 0) {
            setBilledValueChartLoder(1)
        }
        else {
            setBilledValueChartLoder(1)
        }
        if (amountInvPerPlant.Total_Amount_Invoiced.length > 0) {
            setAmountInvPerPlantLoder(1)
        }
        else {
            setAmountInvPerPlantLoder(1)
        }
        if (invoiceProcessingTime.DaysToComplete.length > 0) {
            setInvoiceProcessingTimeLoder(1)
        }
        else {
            setInvoiceProcessingTimeLoder(1)
        }
        if (ProductReturnRateByYear.MTEXT_ClientName.length > 0) {
            setProductReturnRateByYearLoder(1)
        }
        else {
            setProductReturnRateByYearLoder(1)
        }
    }

    return (
        <Box m="10px">
            <Typography
                variant="h3"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 18px 9px" }}
            >
                Sales & Marketing
            </Typography>
            <Grid style={{ position: 'sticky', top: '0', zIndex: '100', backgroundColor: '#d9d9d9' }}>
                <Grid container spacing={2}>

                    <Grid item xs={2} md={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{ marginTop: '-7px' }}>
                                <DatePicker
                                    label={monthYear}
                                    openTo="month"
                                    views={['year', 'month']}
                                    defaultValue={dayjs(currentDate)}
                                    onChange={handleDateChange}
                                // sx={{ width: '300px' }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={2} md={2}>
                        <FormControl fullWidth>
                            <InputLabel id="client-select-label">Route </InputLabel>
                            <Select
                                labelId="client-select-label"
                                id="client-select"
                                value={selectedRegion}
                                label="Client"
                                // sx={{ minWidth: '150px' }}
                                MenuProps={{
                                    PaperProps: { style: { maxHeight: '150px' } }
                                }}
                                onChange={(event) => {
                                    handleRegionChange(event.target.value);
                                }}
                            >
                                {showAllOption && (
                                    <MenuItem key="all-option" value="All">
                                        All
                                    </MenuItem>
                                )}
                                {regions.map((client, i) => (
                                    <MenuItem key={i} value={client.REGIO}>
                                        {client.REGIO}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* billing */}

                    <Grid item xs={2} md={2}>
                        <FormControl fullWidth>
                            <InputLabel id="client-select-label">Dealer</InputLabel>
                            <Select
                                labelId="client-select-label"
                                id="client-select"
                                value={selectedClient}
                                label="Client"
                                // sx={{ minWidth: '250px' }}
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
                            <InputLabel id="client-select-label">Salesman</InputLabel>
                            <Select
                                labelId="client-select-label"
                                id="client-select"
                                value={selectedSalesman}
                                label="Salesman"
                                // sx={{ minWidth: '250px' }}
                                MenuProps={{
                                    PaperProps: { style: { maxHeight: '250px' } }
                                }}
                                onChange={(event) => {
                                    handleSalesmanChange(event.target.value);
                                }}
                            >
                                {showAllOption && (
                                    <MenuItem key="all-option" value="All">
                                        All
                                    </MenuItem>
                                )}
                                {salesData.map((client, i) => (
                                    <MenuItem key={i} value={client.SalesPerson}>
                                        {client.SalesPerson}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* billing end customer */}

                    {/* <Grid item xs={3} md={3}>
                    <ProductSelect product_change={productChange} />
                </Grid> */}

                    <Grid item xs={3} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="client-select-label">Products Category</InputLabel>
                            <Select
                                labelId="client-select-label"
                                id="client-select"
                                value={selectedProduct}
                                label="Products Categorys"
                                // sx={{ minWidth: '250px' }}
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
            </Grid>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={4} md={4}>
                    <GlobalCard
                        currency={loading ? null : '₹'}
                        title="Total Sales Revenue (Gross Sales)"
                        subtitle={billedValueCard.cardValue !== null ? billedValueCard.cardValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '0' : 'Loading...'}
                        // subtitle={loading ? 'Loading...' : totalSalesRevenueCard.cardValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '0'}
                        benchmark={loading ? null : totalSalesRevenueCard.benchmark}
                    />
                </Grid>
                <Grid item xs={4} md={4}>
                    <GlobalCard
                        currency={loading ? null : '₹'}
                        title="Transportation Cost of Revenue"
                        subtitle={TransportationCostofRevenueCard.cardValue !== null ? TransportationCostofRevenueCard.cardValue?.toString() ?? '0' : 'Loading...'}
                        // subtitle={loading ? 'Loading...' : TransportationCostofRevenueCard.cardValue?.toString() ?? '0'}
                        benchmark={loading ? null : TransportationCostofRevenueCard.benchmark}
                    />
                </Grid>
                <Grid item xs={4} md={4}>
                    <GlobalCard
                        currency={loading ? null : '₹'}
                        title="Procurement Cost Savings"
                        subtitle={ProcurementCostSavingsCard.cardValue !== null ? ProcurementCostSavingsCard.cardValue?.toString() ?? '0' : 'Loading...'}
                        // subtitle={loading ? 'Loading...' : ProcurementCostSavingsCard.cardValue?.toString() ?? '0'}
                        benchmark={loading ? null : ProcurementCostSavingsCard.benchmark}
                    />
                </Grid>
                {/* <Grid item xs={3} md={3}>
                    <GlobalCard
                        currency={loading ? null : '₹'}
                        title="Total Billled Value"
                        subtitle={loading ? 'Loading...' : billedValueCard.cardValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '0'}
                        benchmark={loading ? null : billedValueCard.benchmark}
                    />
                </Grid> */}
            </Grid>
            <Grid container spacing={2} mt={1}>
                {/* <Grid item xs={3} md={3}>
                    <GlobalCard
                        title="Number of Customers"
                        subtitle={loading ? 'Loading...' : calculateTotalNumberOfCustomersForecastCard.cardValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '0'}
                        benchmark={loading ? null : calculateTotalNumberOfCustomersForecastCard.benchmark}
                    />
                </Grid> */}
                <Grid item xs={4} md={4}>
                    <GlobalCard
                        currency={loading ? null : '₹'}
                        title="Total Billled Value"
                        subtitle={billedValueCard.cardValue !== null ? billedValueCard.cardValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '0' : 'Loading...'}
                        // subtitle={loading ? 'Loading...' : billedValueCard.cardValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '0'}
                        benchmark={loading ? null : billedValueCard.benchmark}
                    />
                </Grid>

                <Grid item xs={4} md={4}>
                    <GlobalCard
                        currency={loading ? null : '₹'}
                        title="Operating Profit"
                        subtitle={operatingCard.cardValue !== null ? operatingCard.cardValue?.toString() ?? '0' : 'Loading...'}
                        // subtitle={loading ? 'Loading...' : operatingCard.cardValue?.toString() ?? '0'}
                        benchmark={loading ? null : operatingCard.benchmark}
                    />
                </Grid>
                <Grid item xs={4} md={4}>
                    <GlobalCard
                        title="Days of Sales Outstanding"
                        subtitle={dsoCard.cardValue !== null ? dsoCard.cardValue?.toString() ?? '0' : 'Loading...'}
                        // subtitle={loading ? 'Loading...' : dsoCard.cardValue?.toString() ?? '0'}
                        units={loading ? null : 'Days'}
                        benchmark={loading ? null : dsoCard.benchmark}
                    />
                </Grid>
                {/* <Grid item xs={3} md={3}>
                    <GlobalCard
                        title="Late Payment Rate"
                        subtitle={loading ? 'Loading...' : latePaymentRateCard.cardValue?.toString() ?? '0'}
                        units={loading ? null : '%'}
                        benchmark={loading ? null : latePaymentRateCard.benchmark}
                    />
                </Grid> */}
            </Grid>
            <Grid container spacing={2} mt={1}>
                {/* collection below card */}
                <Grid item xs={4} md={4}>
                    <GlobalCard
                        title="Cash to Cash Cycle Time"
                        subtitle={AverageCashToCashCycleTimeCard.cardValue !== null ? AverageCashToCashCycleTimeCard.cardValue?.toString() ?? '0' : 'Loading...'}
                        // subtitle={loading ? 'Loading...' : AverageCashToCashCycleTimeCard.cardValue?.toString() ?? '0'}
                        units={loading ? null : 'Days'}
                        benchmark={loading ? null : AverageCashToCashCycleTimeCard.benchmark}
                    />
                </Grid>
                <Grid item xs={4} md={4}>
                    <GlobalCard
                        title="Order to Cash Cycle Time"
                        subtitle={OrderToCashCycleTimeCard.cardValue !== null ? OrderToCashCycleTimeCard.cardValue?.toString() ?? '0' : 'Loading...'}
                        // subtitle={loading ? 'Loading...' : OrderToCashCycleTimeCard.cardValue?.toString() ?? '0'}
                        units={loading ? null : 'Days'}
                        benchmark={loading ? null : OrderToCashCycleTimeCard.benchmark}
                    />
                </Grid>
                <Grid item xs={4} md={4}>
                    <GlobalCard
                        title="Late Payment Rate"
                        subtitle={latePaymentRateCard.cardValue !== null ? latePaymentRateCard.cardValue?.toString() ?? '0' : 'Loading...'}
                        // subtitle={loading ? 'Loading...' : latePaymentRateCard.cardValue?.toString() ?? '0'}
                        units={loading ? null : '%'}
                        benchmark={loading ? null : latePaymentRateCard.benchmark}
                    />
                </Grid>


            </Grid>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={6} md={6}>
                    {/* <label>Total Sales by Product Category</label> */}
                    <BarCharts
                        labels={totalSalesVQF.MATKL_Material_Category}
                        series={totalSalesVQF.Total_Sales_Volume_Quantity}
                        flag={totalSalesVQFLoder}
                        tilesLables="Total Sales by Product Category"
                        height="320"
                        legend='Total Sales (₹)'
                        format_func={formatRuppes}
                        notificationStatus={onShowAnamoly ? true : false}
                    // NotificationsalesIcon={onShowAnamoly ? true : false}

                    // notificationStatus={true } NotificationsalesIcon
                    />
                </Grid>

                <Grid item xs={6} md={6}>
                    {/* <label>Total Sales by Region</label> */}
                    <DistributedColumnChart
                        labels={totalSalesSBR.REGION}
                        series={totalSalesSBR.Total_Sales_Volume_Quantity}
                        flag={totalSalesSBRLoder}
                        tilesLables="Total Sales by Region"
                        height="320"
                        legend='Total Sales (₹)'
                        format_func={formatRuppes}
                        // notificationStatus={onShowAnamoly ? true : false}
                        notificationStatus={onShowAnamoly ? true : false}
                    />
                </Grid>
            </Grid>
            {/* other billing charts */}
            <Grid container spacing={2} mt={1}>
                <Grid item xs={5} md={5}>
                    {/* <label>Total Billed Value per Product Category</label> */}
                    <PieCharts
                        series={billedValueChart.order_value}
                        labels={billedValueChart.product_cat}
                        flag={billedValueChartLoder}
                        tilesLables="Total Billed Value per Product Category"
                        height="300"
                    />
                </Grid>
                <Grid item xs={7} md={7}>
                    {/* <label>Total Amount Invoiced per Customer</label> */}
                    <BarCharts
                        series={amountInvPerPlant.Total_Amount_Invoiced}
                        labels={amountInvPerPlant.customer_name}
                        flag={amountInvPerPlantLoder}
                        tilesLables="Total Amount Invoiced per Dealer"
                        height="350"
                        legend='Total Amount Invoiced (₹)'
                        format_func={formatRuppes}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={6} md={6}>
                    {/* <label>Invoice Processing Time per Customer</label> */}
                    <DistributedColumnChart
                        series={invoiceProcessingTime.DaysToComplete}
                        labels={invoiceProcessingTime.Delivary_Date}
                        flag={invoiceProcessingTimeLoder}
                        tilesLables="Invoice Processing Time per Dealer"
                        height="350"
                        format_func={formatDays}
                    />
                </Grid>

                <Grid item xs={6} md={6}>
                    {/* <label>Product Return Rate by Year</label> */}
                    <BarCharts
                        labels={ProductReturnRateByYear.MTEXT_ClientName}
                        series={ProductReturnRateByYear.ProductReturnRate}
                        flag={ProductReturnRateByYearLoder}
                        tilesLables="Product Return Rate by Year"
                        format_func={formatPersentage}
                        height='350' />
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={12}>
                    <CompanyWiseTotalInvoiceAmount table_data={companywiseTotalInvoiceAmountFilter} />
                </Grid>
            </Grid>
            <SimpleBackdrop open={loading} handleClose={() => { }} size={80} />


        </Box>
    );
};

export default SalesModule;


