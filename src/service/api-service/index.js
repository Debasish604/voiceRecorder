// import { GET_URL, POST_URL } from "../../Connection";
const BASE_URL = 'http://122.163.121.176:3004'; // Replace with your API's base URL
// const BASE_URL = 'https://192.168.1.200:3007'; 



export const apiService = {


  login: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/dit/auth/login`, {
        method: 'POST',
        body: data
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  purchase: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/purchasedata`, {
        method: 'GET',
        body: data
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);


    }
  },


  billing: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/billing`, {
        method: 'GET',
        body: data
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);


    }
  },

  filterdropdown: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/filterdropdown`, {
        method: 'GET',
        body: data
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  stockRawMaterials: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/stock_row_meterial`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return {
        InventoryTurnover: data.InventoryTurnover[0].InventoryTurnover,
        stockToSalesRatio: data.StockToSalesRatio[0].StockToSalesRatio,
        Stockout_Rate: data.Stockout_Rate[0].Stockout_Rate,
        stockoutRateAndTargetStockRate: data.Stockout_Rate_and_target_Stock_rate,
        supplierLeadTimeVariabilityByClientProduct: data.Supplier_Lead_Time_Variability_by_client_product,
        inventoryTurnoverByProductCategory: data.Inventory_Turnover_By_Product_Catagory,
      };
    } catch (error) {
      throw new Error(`Error fetching inventory turnover data: ${error.message}`);
    }
  },

  Collection: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/collectiondata`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      return {
        CashToCashCycleTime: data.CashToCashCycleTime[0].CashToCashCycleTime,
        OrderToCashCycleTime: data.OrderToCashCycleTime[0].OrderToCashCycleTime,
        ProductReturnRate: data.ProductReturnRate[0].ProductReturnRate,
        Perfect_Order_Rate: data.Perfect_Order_Rate[0].Perfect_Order_Rate,
        Procurement_Cost_Savings: data.Procurement_Cost_Savings[0].Procurement_Cost_Savings,
        Transportation_Cost_as_a_Percentage_of_Revenue: data.Transportation_Cost_as_a_Percentage_of_Revenue[0].Transportation_Cost_as_a_Percentage_of_Revenue,
        ProductReturnRate_by_Year: data.ProductReturnRate_by_Year,

      };
    } catch (error) {
      throw new Error(`Error fetching inventory turnover data: ${error.message}`);
    }
  },

  supply_production: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/productionkpi`)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return {
        OrderFulfillmentAccuracy: data.Order_Fulfillment_Accuracy[0].Order_Fill_Rate,
        ProductcategorywiseSales: data.Product_category_wise_Sales,
        MatchingRate: data.MatchingRatebetweenInvoicesandReceiptsbyUsername,
        dataProductionCostperUnit: data.Production_CostperUnit


      };
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  dispatch: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/despatch`, {
        method: 'GET',
        body: data
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);


    }
  },

  StockFinishedGoods: async () => {

    try {
      const response = await fetch(`${BASE_URL}/dit/data/stock_finish_goods`)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return {
        dataOrderFillRate: data.OrderFillRate[0].OrderFillRate,
        PerfectOrderRate: data.Perfect_Order_Rate[0].Perfect_Order_Rate,
        InventoryTurnoverByProductCatagory: data.Inventory_Turnover_By_Product_Catagory,
        dataCashToCashCycleTime: data.CashToCashCycleTime,



      };
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);


    }
  },

  SupplierRiskScore: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/SupplierRiskScore_Forecast`, {
        method: 'GET'
      })
      if (!response.ok) {
        throw new Error(`Network response was not ok`);
      }
      return await response.json()
    }
    catch (e) {
      throw new Error(`Error fetchin data: ${e.message}`);
    }
  },
  Supplier_Diversification_Ratio_Forecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Supplier_Diversification_Ratio_Forecast`, {
        method: 'GET'
      })
      if (!response.ok) {
        throw new Error(`Network response was not ok`);
      }
      return await response.json()
    }
    catch (e) {
      throw new Error(`Error fetchin data: ${e.message}`);
    }
  },
  Supplier_Lead_Time_Variability: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Supplier_Lead_Time_Variability_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  Supplier_Lead_Time_Variability_MaterialNumberForecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Supplier_Lead_Time_Variability_MaterialNumberForecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  SupplierQualityIndex: async () => {
    try {
      const response = await fetch(`${BASE_URL}/DIT/api/purches/SupplierQualityIndex`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  SupplierPerformanceScore: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Supplier_Performance_Score_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  //-----------------Stock and Raw Material-----------------
  InventoryTurnover: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/InventoryTurnover_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  StocktoSalesRatio: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/StocktoSalesRatio_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  Stockout_Rate: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Stockout_Rate_Forecast`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  // consumptionrate
  Consumption_Rate: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/consumption_Rate_Forecast`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  // consumptionrate
  Despatch_Rate: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Despatch_Rate_Forecast`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  //-----------Production---------------------//
  OrderFulfillmentAccuracyForecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Order_Fulfillment_Accuracy_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  ProductionPlanFulfillmentPercentageForecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/ProductionPlanFulfillmentPercentage_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  ProductionCostperUnitForecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Production_CostperUnit_Forecast`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  MatchingRateBetweenInvoicesAndReceiptsForecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Matching_Rate_Between_Invoices_And_Receipts_Forecast`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  ProductCategoryWiseSalesForecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/ProductCategoryWiseSales_Forecast`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  //-----------------Stock Finish Goods-----------------

  PerfectOrderRate: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Perfect_Order_Rate_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  backOrderRate: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Back_order_rate_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  // OrderFillRate: async () => {

  //-----------------Dispatch-----------------
  OrderFillRateForecast: async () => {

    try {
      const response = await fetch(`${BASE_URL}/dit/data/Order_Fill_Rate_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  CashCycle: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/CashToCashCycleTimeByPositionKeyYear_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },



  OnTimeDeliveryPerformance: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/OnTimeDeliveryPerformance_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  //delete no use
  AverageLeadTimeForecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/AverageLeadTime_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  DeliveryStatus: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/DeliveryStatusbyDistribution_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  AverageLeadTime: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/AverageLeadTime_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  //-----------------Billing-----------------
  LatePaymentRate: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/LatePaymentRate_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  //-------------------Collection-------------------------
  CashToCashCycleTime: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/cashTocashCycleTimeForcast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },


  PerfectOrderRateForecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Perfect_Order_Rate_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },




  //--------------------InvoiceProcessingTime_Forecast---------------------
  InvoiceProcessingTime: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/InvoiceProcessingTime_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  //----AmountInvoicedperPlant_Forecast----
  AmountInvPerPlant: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/AmountInvoicedperPlant_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  //-----------Company Wise Total Invoice Amount-------------
  Company_Wise_Total_Invoice_Amount: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/CompanyWiseTotalInvoiceAmount_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },




  // InvoiceProcessingTime: async () => {

  //   try {
  //     const response = await fetch(`${BASE_URL}/dit/data/InvoiceProcessingTime_Forecast`);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return await response.json();
  //   } catch (error) {
  //     throw new Error(`Error fetching data: ${error.message}`);
  //   }
  // },
  // AmountInvPerPlant: async () => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/dit/data/AmountInvoicedperPlant_Forecast`);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //       }
  //       return await response.json();
  //       } catch (error) {
  //         throw new Error(`Error fetching data: ${error.message}`);
  //         }
  //         },
  // Company_Wise_Total_Invoice_Amount: async () => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/dit/data/CompanyWiseTotalInvoiceAmount_Forecast`);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return await response.json();
  //   } catch (error) {
  //     throw new Error(`Error fetching data: ${error.message}`);
  //   }
  // },


  ProductReturnRate: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/productReturnRateByYearForecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  OrderToCashCycleTime: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/orderToCashCycleTimeForecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  ProcurementCostSavings: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/ProcurementCostSavings_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  TransportationCostofRevenue: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/TransportationCostofRevenue_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  Dso: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Days_of_Sales_Outstanding`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  OperatingProfit: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/CalculateOperating_Profit`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },



  // admin bench mark value show
  benchmarkShow: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/getallkpi`, {
        method: 'GET',
        body: data
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);

    }
  },

  // benchmark update 

  benchmarkUpdate: async (kpiId, benchmarkValue) => {
    const data = {
      "KPI_ID": kpiId,
      "BENCHMARK_VALUE": benchmarkValue
    };

    try {
      const response = await fetch(`${BASE_URL}/dit/data/benchmark_update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  //----------insights api--------------------
  SupplierLeadTimeVariabilityChatData: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/DIT/api/Insights/SupplierLeadTimeVariabilityinsightchat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  getSummarySupplierLeadTimeVariability: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/DIT/api/Insights/get_summary_Supplier_Lead_Time_Variability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  user_input_insight: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/DIT/api/aug_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },



  // -----------------------Schemes--------------------
  Conversion_Rate: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Conversion_Rate_from_Scheme_Participants_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },


  //-----------------------------------------------Sales--------------------------------
  TotalSalesRevenueForecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Total_Sales_Revenue_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  TotalSalesSalesGrowthData: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Calculate_Sales_Growth_Rate`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  TotalSalesVolumeQuantityForecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Total_Sales_Volume_Quantity_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  CalculateTotalNumberOfCustomersForecast: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Calculate_Total_NumberOfCustomers_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  BilledValue: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Build_Values_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  ProductionPlanVariance: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/Production_PlanVariance_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  // dashobard client top and bottom api

  dashboardTopBottomClient: async () => {
    try {
      // const response = await fetch(`${BASE_URL}/dit/data/dashboardtopbottomclient`);
      const response = await fetch(`${BASE_URL}/dit/data/dashboardtopbottompurchaseclient`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },


  // dashboardTopBottomCustomer: async () => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/dit/data/dashboardtopbottomcustomer`);

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     return await response.json();
  //   } catch (error) {
  //     throw new Error(`Error fetching data: ${error.message}`);
  //   }
  // },

  // dashboardtopbottomplant: async () => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/dit/data/dashboardtopbottomplant`);

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     return await response.json();
  //   } catch (error) {
  //     throw new Error(`Error fetching data: ${error.message}`);
  //   }
  // },

  //-----------dashboard----------------- 

  DashboardStockRawMaterial: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/dashboardtopbottomstockrawclient`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  DashboardProduction: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/dashboardtopbottomproductionplant`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  DashboardDispatch: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/dashboardtopbottomdispatchcustomer`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  DashboardRecievable: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/dashboardtopbottombildvaluesrecievable`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },


  //-----------New KPI------------
  InventoryAge: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/InventoryAgeInDays_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  CapacityUtilization: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/CapacityUtilization_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  OverallYeild: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/overallYeild_Forecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  InventoryTurnoverStockedFG: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/InventoryTurnover_Forecast_Product`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },

  //  anamoly load api
  //----------insights api supply risk score--------------------
  SupplierRiskScoreForecastShow: async () => {
    try {
      const response = await fetch(`${BASE_URL}/DIT/api/Insights/SupplierRiskScoreForecast`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
   //----------Total Sales by Product Category--------------------
  TotalSalesbyProductCategoryShow: async () => {
    try {
      const response = await fetch(`${BASE_URL}/DIT/api/sales_aug_chatbot`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },



  SupplierRiskScoreForecast_chatButton: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/DIT/api/Insights/SupplierRiskScoreForecast_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  
  get_summary_SupplierRiskScoreData: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/DIT/api/Insights/get_summary_SupplierRiskScore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },


  Raw_Materials_Total_Cost_Amount_Wise_Tabular_Data: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/filter_Raw_goods_Total_Cost_Amount_Wise_Tabular_Data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },


  // Raw_Materials_Total_Cost_Amount_Wise_Tabular_Data: async (data) => {
  //   try {
  //     const response = await fetch(GET_URL.Raw_Materials_Total_Cost_Amount_Wise_Tabular_Data, {
  //       method: 'GET',
  //       body: data
  //     });
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return await response.json();
  //   } catch (error) {
  //     throw new Error(`Error fetching data: ${error.message}`);


  //   }
  // },

  // Finished_Goods_Total_Cost_Amount_Wise_Tabular_Data: async (data) => {
  //   try {
  //     const response = await fetch(GET_URL.Finished_Goods_Total_Cost_Amount_Wise_Tabular_Data, {
  //       method: 'GET',
  //       body: data
  //     });
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return await response.json();
  //   } catch (error) {
  //     throw new Error(`Error fetching data: ${error.message}`);
  //   }
  // },

  Finished_Goods_Total_Cost_Amount_Wise_Tabular_Data: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/dit/data/filter_FG_goods_Total_Cost_Amount_Wise_Tabular_Data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },



  user_input_insight_sales: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/DIT/api/sales_aug_chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },
  user_input_insight_sales2: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/DIT/api/sales_aug_chatbot2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  },


};

