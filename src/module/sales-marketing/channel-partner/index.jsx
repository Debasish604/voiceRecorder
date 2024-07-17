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
    filterByDateRouteDealerSales,
    filterByDateDealerProductSales,
    filterByDateRouteDProductsales,
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





const ChannelPartnerPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const showAllOption = true; // or false, depending on your requirement
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [selectedDate, setSelectedDate] = useState('');
    const [monthYear, setmonthYear] = useState('Select month and year');
    const currentDate = new Date();
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');

    //---------------Sales Growth Data--------------------
    const [totalSalesRevenueData, settotalSalesRevenueData] = useState([]);
    const [totalSalesGrowthCard, settotalSalesGrowthCard] = useState({ cardValue: null, benchmark: null })


    const fetchSalesData = async () => {
        try {
            //------------------------------Total_Sales_Revenue_Forecast--------------------
            const totalSalesRevenueResponse = await apiService.TotalSalesSalesGrowthData();
            settotalSalesRevenueData(totalSalesRevenueResponse.Sales_Growth_Rate);
            console.log('date', selectedDate);
            if (totalSalesRevenueResponse.status === 'success' && selectedDate) {
                const filteredTC = filterByDate(totalSalesRevenueResponse.Sales_Growth_Rate, selectedDate)
                const persentageQS = calculateAverage(filteredTC, 'SalesGrowthRate')
                console.log('Sales_Growth_Rate', persentageQS)
                settotalSalesGrowthCard({ cardValue: persentageQS, benchmark: 'low' })

            }
        }
        catch (error) {
            console.error('Error fetching data:', error.message);
        }

    }

    useEffect(() => {
        const formattedDataDate = dayjs(currentDate).format('MMM YYYY');
        setSelectedDate(formattedDataDate);


    }, [])

    useEffect(() => {
        fetchSalesData();

    }, [selectedDate])

    const [clients, setClients] = useState([]);
    const [salesData, setSalesman] = useState([]);
    const [products, setproducts] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedSalesman, setselectedSalesman] = useState('');
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
                // setSelectedRegion(regionData[0].REGIO);
                // setSelectedClient(clientData[0].NAME1);
                // setselectedSalesman(SalesmanData[0].SalesPerson);
                // setSelectedProduct(productData[0].MATKL_Material_Category);
                setSelectedRegion('All');
                setSelectedClient('All');
                setselectedSalesman('All');
                setSelectedProduct('All');
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };
    useEffect(() => {
        // fetchRegion();
        // billing
        // fetchBenchMark()
        fetchFilterData()

    }, []);

    const handleDateChange = (newValue) => {
        try {
            const formattedDataDate = dayjs(newValue).format('MMM YYYY');
            setSelectedDate(formattedDataDate);
            console.log('Selected date:', formattedDataDate);
            console.log('hanfle data change');
            // ***************************sales***********************************************




        } catch (error) {
            console.error('Error fetching data for the selected date:', error.message);
        }

    };



    return (
        <Box m="10px">


            <Typography
                variant="h3"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 10px 5px" }}
            >
                Key Account Manager
            </Typography>

            <Grid container spacing={2}>

                <Grid item xs={3} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']} sx={{ marginTop: '-7px' }}>
                            <DatePicker
                                label={monthYear}
                                openTo="month"
                                views={['year', 'month']}
                                defaultValue={dayjs(currentDate)}
                                onChange={handleDateChange}

                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={3} md={3}>
                    <FormControl fullWidth>
                        <InputLabel id="client-select-label">Route </InputLabel>
                        <Select
                            labelId="client-select-label"
                            id="client-select"
                            // value={selectedRegion}
                            label="Client"
                            // sx={{ minWidth: '150px' }}
                            MenuProps={{
                                PaperProps: { style: { maxHeight: '150px' } }
                            }}
                            onChange={(event) => {
                                // handleRegionChange(event.target.value);
                            }}
                        >


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
                                // handleSalesmanChange(event.target.value);
                            }}
                        >

                        </Select>
                    </FormControl>
                </Grid>



                <Grid item xs={3} md={3}>
                    <FormControl fullWidth>
                        <InputLabel id="client-select-label">Products Category</InputLabel>
                        <Select
                            labelId="client-select-label"
                            id="client-select"
                            // value={selectedProduct}
                            label="Products Categorys"
                            // sx={{ minWidth: '250px' }}
                            MenuProps={{
                                PaperProps: { style: { maxHeight: '250px' } }
                            }}
                            onChange={(event) => {
                                // productChange(event.target.value);
                            }}
                        >


                        </Select>
                    </FormControl>
                </Grid>
            </Grid>


            <Grid container spacing={2} mt={1}>
                <Grid item xs={3} md={3}>
                    <GlobalCard
                        // currency={loading ? null : '₹'}
                        title="Sales Growth Data"
                        subtitle={loading ? 'Loading...' : totalSalesGrowthCard.cardValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '0'}
                    // benchmark={loading ? null : totalSalesGrowthCard.benchmark}


                    />
                </Grid>
                <Grid item xs={3} md={3}>
                    <GlobalCard
                        // currency={loading ? null : '₹'}
                        // title="Transportation Cost of Revenue"
                        // subtitle={loading ? 'Loading...' : TransportationCostofRevenueCard.cardValue?.toString() ?? '0'}
                        // benchmark={loading ? null : TransportationCostofRevenueCard.benchmark}
                        subtitle="Up-sell Ratio"
                    />
                </Grid>
                <Grid item xs={3} md={3}>
                    <GlobalCard
                        // currency={loading ? null : '₹'}
                        // title="Procurement Cost Savings"
                        // subtitle={loading ? 'Loading...' : ProcurementCostSavingsCard.cardValue?.toString() ?? '0'}
                        // benchmark={loading ? null : ProcurementCostSavingsCard.benchmark}
                        subtitle="Average Deal Size"
                    />
                </Grid>
                <Grid item xs={3} md={3}>
                    <GlobalCard
                        // currency={loading ? null : '₹'}
                        // title="Total Billled Value"
                        // subtitle={loading ? 'Loading...' : billedValueCard.cardValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '0'}
                        // benchmark={loading ? null : billedValueCard.benchmark}
                        subtitle="Customer Lifetime Value(CLV)"
                    />
                </Grid>
            </Grid>





















        </Box>

    );



};

export default ChannelPartnerPage;


