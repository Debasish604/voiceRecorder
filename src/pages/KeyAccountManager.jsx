import React from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import GlobalCard from "../../../components1/GlobalCard";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from "react";
// import { apiService } from "../../../service/api-service";
import ProductSelect from "../../../components1/dropdown/ProductCategory";

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



import DistributedColumnChart from '../../../components1/charts/DistributedColumnChart';
import BarCharts from '../../../components1/charts/Barchart';
import SimpleBackdrop from '../../../scenes/global/Loader';
import CompanyWiseTotalInvoiceAmount from '../../supplychain/billing/Company_Wise_TotalInvoiceAmount';
import PieCharts from '../../../components1/charts/PieCharts';
import { useLocation } from 'react-router-dom';





const KeyAccountManager = () => {
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
                                // value={selectedSalesman}
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
                        // title="Total Sales Revenue (Gross Sales)"
                        // subtitle={loading ? 'Loading...' : totalSalesRevenueCard.cardValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '0'}
                        // benchmark={loading ? null : totalSalesRevenueCard.benchmark}
                        subtitle="Cross-Sell"
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



            <Grid container spacing={2} mt={1}>
                <Grid item xs={6} md={6}>
                    <BarCharts
                        labels={['Category 1', 'Category 2', 'Category 3']}
                        series={[1000, 2000, 1500]}
                        flag={false}
                        tilesLables="Total Sales by Product Category"
                        height="320"
                        legend='Total Sales (₹)'
                    // format_func={formatRuppes}
                    // notificationStatus={onShowAnamoly ? true : false}
                    />
                </Grid>

                <Grid item xs={6} md={6}>
                    <DistributedColumnChart
                        labels={['Region A', 'Region B', 'Region C']}
                        series={[5000, 3000, 2000]}
                        flag={false}
                        tilesLables="Total Sales by Region"
                        height="320"
                        legend='Total Sales (₹)'
                    // format_func={formatRuppes}
                    />
                </Grid>
            </Grid>



            <Grid container spacing={2} mt={1}>
                <Grid item xs={5} md={5}>
                    <PieCharts
                        series={[3000, 5000, 2000]}
                        labels={['Category A', 'Category B', 'Category C']}
                        flag={false} // Assuming no loading
                        tilesLables="Total Billed Value per Product Category"
                        height="300"
                    />
                </Grid>
                <Grid item xs={7} md={7}>
                    <BarCharts
                        series={[15000, 10000, 8000]}
                        labels={['Customer X', 'Customer Y', 'Customer Z']}
                        flag={false} // Assuming no loading
                        tilesLables="Total Amount Invoiced per Dealer"
                        height="350"
                        legend='Total Amount Invoiced (₹)'
                        format_func={formatRuppes}
                    />
                </Grid>
            </Grid>



















        </Box>

    );



};

export default KeyAccountManager;


