
export const calculateSum = (data, fieldName) => {
    return data.reduce((sum, item) => sum + parseInt(item[fieldName]), 0);
};

// export const calculatePercentage = (data, fieldName) => {
//     const sum = data.reduce((total, item) => total + parseInt(item[fieldName]), 0);
//     const percentage = (sum / (data.length > 0 ? data.length : 1)) * 100; // Prevent division by zero

//     return percentage.toFixed(2); // Adjust the number of decimal places as needed
//   };

export const calculateGroupBySum = (data, keyName, valueName) => {
    const result = data.reduce((groupedData, item) => {
        const key = item[keyName];
        const value = item[valueName];

        if (!groupedData[key]) {
            groupedData[key] = 0;
        }

        groupedData[key] += value;
        return groupedData;
    }, {});

    const roundedResult = Object.fromEntries(
        Object.entries(result).map(([key, value]) => [key, Math.round(value * 100) / 100])
    );

    const keys = Object.keys(roundedResult);
    const values = Object.values(roundedResult);

    return {
        [keyName]: keys,
        [valueName]: values
    };
};

export const filterAndSumSingleColumn = async (data, filterValue, filterColumn, getScore) => {
    return await data.reduce((sum, el) => {
        if (filterColumn(el).toLowerCase() === filterValue.toLowerCase()) {
            sum += parseInt(getScore(el));
        }
        return sum;
    }, 0);
};

export const filterAndSumClientProduct = (data, clientName, productCategory, getScore) => {
    return data.reduce((sum, el) => {
        if (
            el.MTEXT_ClientName.toLowerCase() === clientName.toLowerCase() &&
            el.MATKL_Material_Category.toLowerCase() === productCategory.toLowerCase()
        ) {
            sum += parseInt(getScore(el));
        }
        return sum;
    }, 0);
};

//--------------new ----------------------------------

export const calculateAveragePercentage = (data, columnName) => {
    const sum = data.reduce((total, item) => total + parseFloat(item[columnName] || 0), 0);
    const totalCount = data.length;

    if (totalCount === 0 || sum === 0) {
        return 0; // To avoid division by zero
    }
    const average = sum / totalCount;
    // const percentage = (average / 100) * 100;
    const percentage = (average / sum) * 100;

    return percentage.toFixed(2);
};


// item[columnName] 
export const calculateAverage = (data, columnName) => {
    const sum = data.reduce((total, item) => total + parseFloat(item[columnName] || 0), 0);
    const totalCount = data.length;

    if (totalCount === 0 || sum === 0) {
        return 0; // To avoid division by zero
    }
    const average = sum / totalCount;
    // const percentage = (average / 100) * 100;
    // const percentage = (average / sum) * 100;

    return average.toFixed();
};

export const calculateGroupByPercentage = (data, keyName, valueName) => {
    const result = data.reduce((groupedData, item) => {
        const key = item[keyName];
        const value = item[valueName];
        // const value = parseFloat(item[valueName]); // Convert to numeric type


        if (!groupedData[key]) {
            groupedData[key] = 0;
        }

        groupedData[key] += value;
        return groupedData;
    }, {});

    const totalValues = Object.values(result).reduce((sum, value) => sum + value, 0);

    // Check if totalValues is zero to avoid division by zero
    if (totalValues === 0) {
        // Handle this case based on your application's requirements
        return {
            [keyName]: [],
            [valueName]: []
        };
    }

    const percentageResult = Object.fromEntries(
        Object.entries(result).map(([key, value]) => [key, (value / totalValues) * 100])
    );

    const roundedPercentageResult = Object.fromEntries(
        Object.entries(percentageResult).map(([key, value]) => [key, Math.round(value * 100) / 100])
    );

    const keys = Object.keys(roundedPercentageResult);
    const values = Object.values(roundedPercentageResult);

    return {
        [keyName]: keys,
        [valueName]: values
    };
};





// export const calculateGroupByPercentage = (data, keyName, valueName) => {
//     const result = data.reduce((groupedData, item) => {
//         const key = item[keyName];
//         const value = item[valueName];

//         if (!groupedData[key]) {
//             groupedData[key] = 0;
//         }

//         groupedData[key] += value;
//         return groupedData;
//     }, {});

//     const totalValues = Object.values(result).reduce((sum, value) => sum + value, 0);

//     const percentageResult = Object.fromEntries(
//         Object.entries(result).map(([key, value]) => [key, (value / totalValues) * 100])
//     );

//     const roundedPercentageResult = Object.fromEntries(
//         Object.entries(percentageResult).map(([key, value]) => [key, Math.round(value * 100) / 100])
//         // Object.entries(percentageResult).map(([key, value]) => [key, Math.round(value * 100) / totalValues])
//     );

//     const keys = Object.keys(roundedPercentageResult);
//     const values = Object.values(roundedPercentageResult);

//     return {
//         [keyName]: keys,
//         [valueName]: values
//     };
// };


// export const calculateGroupByAverage = (data, keyName, valueName) => {
//     const groupedData = data.reduce((result, item) => {
//         const key = item[keyName];
//         const value = item[valueName];

//         if (!result[key]) {
//             result[key] = { sum: 0, count: 0 };
//         }

//         result[key].sum += value;
//         result[key].count += 1;

//         return result;
//     }, {});

//     const averages = Object.fromEntries(
//         Object.entries(groupedData).map(([key, { sum, count }]) => [key, sum / count])
//     );

//     const keys = Object.keys(averages);
//     const values = Object.values(averages);

//     return {
//         [keyName]: keys,
//         [valueName]: values,
//     };
// };
export const calculateGroupByAverage = (data, keyName, valueName) => {
    // console.log('keyName', keyName);
    const groupedData = data.reduce((result, item) => {
        const key = item[keyName];
        const value = item[valueName];

        if (!result[key]) {
            result[key] = { sum: 0, count: 0 };
        }

        result[key].sum += value;
        result[key].count += 1;

        return result;
    }, {});


    const averages = Object.fromEntries(
        Object.entries(groupedData).map(([key, { sum, count }]) => [
            key,
            count === 0 ? 0 : sum / count,
        ])
    );

    const keys = Object.keys(averages);
    const values = Object.values(averages);

    return {
        [keyName]: keys,
        [valueName]: values,
    };
};



export const calculateGroupByAverageDateWish = (data, keyName, valueName, dateModuleName) => {
    const groupedData = data.reduce((result, item) => {
        const key = item[keyName];
        const value = item[valueName];
        const dateModule = item[dateModuleName];

        if (!result[key]) {
            result[key] = { sum: 0, count: 0, dateModules: [] };
        }

        result[key].sum += value;
        result[key].count += 1;
        result[key].dateModules.push(dateModule);

        return result;
    }, {});

    const averages = Object.fromEntries(
        Object.entries(groupedData).map(([key, { sum, count, dateModules }]) => [
            key,
            {
                average: count === 0 ? 0 : sum / count,
                dateModules: dateModules.filter((date, index, self) => self.indexOf(date) === index),
            },
        ])
    );

    const keys = Object.keys(averages);
    const values = keys.map(key => averages[key].average);
    const dateModules = keys.map(key => averages[key].dateModules);

    return {
        [keyName]: keys,
        [valueName]: values,
        [dateModuleName]: dateModules,
    };
};


// export const transformDataForChart = (data, keyName, valueName, dateModuleName) => {
//     console.log('data',data);
//     const groupedData = data.reduce((result, item) => {
//         const key = item[keyName];
//         const value = item[valueName];
//         const dateModule = item[dateModuleName];

//         if (!result[key]) {
//             result[key] = { data: {}, dates: [] };
//         }

//         if (!result[key].data[dateModule]) {
//             result[key].data[dateModule] = 0;
//         }

//         result[key].data[dateModule] += value;
//         result[key].dates.push(dateModule);

//         return result;
//     }, {});

//     const series = Object.entries(groupedData).map(([category, { data }]) => ({
//         name: category,
//         data: Object.values(data).map(value => parseFloat(value.toFixed(2))), // Format to 2 decimal places
//     }));

//     const labelcategory = [...new Set(Object.values(groupedData)[0].dates)]; // Use Set to get unique dates
//     return { series, labelcategory };
// };

export const transformDataForChart = (data, keyName, valueName, dateModuleName) => {
    // console.log('data', data);

    const groupedData = data.reduce((result, item) => {
        const key = item[keyName];
        const value = item[valueName];
        const dateModule = item[dateModuleName];

        if (!result[key]) {
            result[key] = { data: {}, dates: [] };
        }

        if (!result[key].data[dateModule]) {
            result[key].data[dateModule] = 0;
        }

        result[key].data[dateModule] += value;

        if (!result[key].dates.includes(dateModule)) {
            result[key].dates.push(dateModule);
        }

        return result;
    }, {});

    // const series = Object.entries(groupedData).map(([category, { data }]) => ({
    //     name: category,
    //     data: Object.values(data).map(value => parseFloat(value.toFixed(2))), // Format to 2 decimal places
    // }));
    
    const series = Object.entries(groupedData)
  .sort((a, b) => a[0].localeCompare(b[0])) // Sort based on category names
  .map(([category, { data }]) => ({
    name: category,
    data: Object.values(data).map(value => parseFloat(value.toFixed(2))),
  }));

    const firstGroupedData = Object.values(groupedData)[0] || { dates: [] };
    // const labelcategory = [...new Set(firstGroupedData.dates)]; // Use Set to get unique dates
    const labelcategory = [...new Set(firstGroupedData.dates)].sort((a, b) => new Date(a) - new Date(b));


    return { series, labelcategory };
};

const formatDate = (dateString) => {
    const originalDate = new Date(dateString);
    const formattedDate = originalDate.toLocaleString('default', { month: 'short', year: 'numeric' });
    return formattedDate;
};

export const dateFormationDataKey = (data) => {
    const DataDateFormetChange = data.map(obj => ({
        ...obj,
        Date_Module: formatDate(obj.Date_Module)
    }));
    return DataDateFormetChange
}

export const filterByDateAndClient = (data, date, client) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.MTEXT_ClientName?.toLowerCase() === client.toLowerCase()
    );
};

export const filterByDateAndplant = (data, date, plant) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.plant_name?.toLowerCase() === plant.toLowerCase()
    );
};

export const filterByDateAndClientAndPlant = (data, date, client, plant) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.MTEXT_ClientName?.toLowerCase() === client.toLowerCase()
            && obj.plant_name?.toLowerCase() === plant.toLowerCase()
    );
};

export const filterByDateAndPlantAndProduct = (data, date, plant, product) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.plant_name?.toLowerCase() === plant.toLowerCase()
            && obj.MATKL_Material_Category?.toLowerCase() === product.toLowerCase()
    );
};




//--------------old--------------------------
export const filterByDateAndCustomer = (data, date, client) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.customer_name.toLowerCase() === client.toLowerCase()
    );
};

export const filterByDateAndCustomerN = (data, date, client) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.Customer_Name.toLowerCase() === client.toLowerCase()
    );
};
export const filterByDateAndCustomerALT = (data, date, client) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.NAME1_Customer_Name.toLowerCase() === client.toLowerCase()
    );
};

export const filterByDateAndCustomerOPT = (data, date, client) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.MTEXT_ClientName.toLowerCase() === client.toLowerCase()
    );
};
//-------------------Filter By Plant------------------
export const filterByDatePlant = (data, date, plant) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.Plant_Name.toLowerCase() === plant.toLowerCase()
    );
};

export const filterByDatePlantProduct = (data, date, plant, product) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.Plant_Name.toLowerCase() === plant.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
    );
};

//-----------------------------
export const filterByDate = (data, date) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date

    );
}; 
export const filterByDateRegion = (data, date, region) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.REGION.toLowerCase() === region.toLowerCase()

    );
};
export const filterByDateRegionProduct = (data, date, region, product) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.REGION.toLowerCase() === region.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()

    );
};
export const filterByDateProduct = (data, date, product) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
    );
};
export const filterByDateClientProduct = (data, date, client, product) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.MTEXT_ClientName.toLowerCase() === client.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
    );
};




export const filterByDateClientPlantProduct = (data, date, client, plant, product) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.MTEXT_ClientName.toLowerCase() === client.toLowerCase()
            && obj.plant_name.toLowerCase() === plant.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
    );
};

export const filterByDateClientPlant = (data, date, client, plant) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.MTEXT_ClientName.toLowerCase() === client.toLowerCase()
            && obj.plant_name.toLowerCase() === plant.toLowerCase()
    );
};

export const filterByDateClientPlantForChart = (data, date, client, plant) => {
    console.log('date', date);
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module.toLowerCase() === date.toLowerCase()
            && obj.MTEXT_ClientName.toLowerCase() === client.toLowerCase()
            && obj.plant_name.toLowerCase() === plant.toLowerCase()
    );
};

// export const filterBenchMarkData = (data, kpiName) => {
//     const filteredArray = data.filter(item => item.KPI_NAME.toLowerCase().includes(kpiName.toLowerCase()));
//     console.log('filteredArray',filteredArray)
//     if (filteredArray[0].BENCHMARK_VALUE === null) {
//         return 0
//     }
//     const numericValues = parseFloat(filteredArray[0].BENCHMARK_VALUE);
//     console.log('numericValues',numericValues);
//     return numericValues
// };

export const filterBenchMarkData = (data, kpiName) => {
    const filteredArray = data.filter(item => item.KPI_NAME.toLowerCase().includes(kpiName.toLowerCase()));
    // console.log('filteredArray', filteredArray);

    // Check if filteredArray is empty
    if (filteredArray.length === 0) {
        console.warn('No matching data found for KPI_NAME:', kpiName);
        return 0;
    }

    // Check if BENCHMARK_VALUE is null
    if (filteredArray[0].BENCHMARK_VALUE === null) {
        return 0;
    }

    const numericValues = parseFloat(filteredArray[0].BENCHMARK_VALUE);
    // console.log('numericValues', numericValues);
    return numericValues;
};




// export const filterByClientProductDate = (data, materialCategory, clientName) => {
//     return data.filter(
//         item =>
//             item.MATKL_Material_Category.toLowerCase() === materialCategory.toLowerCase() &&
//             item.MTEXT_ClientName.toLowerCase() === clientName.toLowerCase()
//     );
// };
// export const filterByProductClientDate = (data, materialCategory, clientName, dateModule) => {
//     return data.filter(
//         item =>
//             item.MATKL_Material_Category.toLowerCase() === materialCategory.toLowerCase() &&
//             item.MTEXT_ClientName.toLowerCase() === clientName.toLowerCase() &&
//             item.Date_Module.toLowerCase() === dateModule.toLowerCase()
//     );
// };


export const formatPersentage = (value) => {
    return value.toFixed(2) + "%"
};
export const formatDays = (value) => {
    return value.toFixed() + ' Days'
};
export const formatQuantity = (value) => {
    return value.toFixed()
};
export const formatRuppes = (value) => {
    // return value.toFixed() + ' ₹'
    return '₹' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const formatRuppesTooltip = (value) => {
    return '₹' + value.toFixed(2)
    // return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ₹';
};

//----------------new add 19-12-2023--------------------
//convert key name lower case
const convertKeysToLowerCase = (obj) => {
    const newObject = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObject[key.toLowerCase()] = obj[key];
        }
    }
    return newObject;
};
//----------------duplicate old----------------------


export const filterByDateCustomerProduct = (data, date, client, product) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.customer_name.toLowerCase() === client.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
    );
};
export const filterByDateCustomerProductN = (data, date, client, product) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.Customer_Name.toLowerCase() === client.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
    );
};

export const filterByDateCustomerProductRegionN = (data, date, client, product, region) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.Customer_Name.toLowerCase() === client.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            && obj.REGION.toLowerCase() === region.toLowerCase()
    );
};


export const filterByDateCustomerProductALT = (data, date, client, product) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.NAME1_Customer_Name.toLowerCase() === client.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
    );
};

//----------------new ----------------------

export const filterByDateAndCustomerNew = (data, date, client) => {
    const lowerCaseData = dateFormationDataKey(data).map(obj => convertKeysToLowerCase(obj));
    return lowerCaseData.filter(
        obj => obj.date_module === date
            && obj.customer_name.toLowerCase() === client.toLowerCase()
    );
};
export const filterByDateAndCustomerSAP = (data, date, client) => {
    const lowerCaseData = dateFormationDataKey(data).map(obj => convertKeysToLowerCase(obj));
    return lowerCaseData.filter(
        obj => obj.date_module === date
            && obj.name1_customer_name.toLowerCase() === client.toLowerCase()
    );
};

export const filterDateCustomerProduct = (data, date, client, product) => {
    const lowerCaseData = dateFormationDataKey(data).map(obj => convertKeysToLowerCase(obj));
    return lowerCaseData.filter(
        obj => obj.date_module === date
            && obj.customer_name.toLowerCase() === client.toLowerCase()
            && obj.matkl_material_category.toLowerCase() === product.toLowerCase()
    );
};
export const filterDateCustomer = (data, date, client, product) => {
    const lowerCaseData = dateFormationDataKey(data).map(obj => convertKeysToLowerCase(obj));
    return lowerCaseData.filter(
        obj => obj.date_module === date
            && obj.customer_name.toLowerCase() === client.toLowerCase()
    );
};
export const filterDateCustomerProductSAP = (data, date, client, product) => {
    const lowerCaseData = dateFormationDataKey(data).map(obj => convertKeysToLowerCase(obj));
    return lowerCaseData.filter(
        obj => obj.date_module === date
            && obj.name1_customer_name.toLowerCase() === client.toLowerCase()
            && obj.matkl_material_category.toLowerCase() === product.toLowerCase()
    );
};



//---------------sales man--
export const filterByDateRouteDealerProduct = (data, date, route,dealer,product) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.Customer_Name.toLowerCase() === dealer.toLowerCase()
            && obj.REGION.toLowerCase() === route.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
    );
};

export const lowerfilterByDateRouteDealerProduct = (data, date, route,dealer,product) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.customer_name.toLowerCase() === dealer.toLowerCase()
            && obj.Region.toLowerCase() === route.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
    );
};

 
 

export const filterByDateRouteDealerProductSales= (data, date, route,dealer,product,selectedValue) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.Customer_Name.toLowerCase() === dealer.toLowerCase()
            && obj.REGION.toLowerCase() === route.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            && obj.SalesPerson.toLowerCase() === selectedValue.toLowerCase()  
    );
};

export const lowerfilterByDateRouteDealerProductSales= (data, date, route,dealer,product,selectedValue) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.customer_name.toLowerCase() === dealer.toLowerCase()
            && obj.Region.toLowerCase() === route.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            && obj.SalesPerson.toLowerCase() === selectedValue.toLowerCase()  
    );
};
export const lowerfilterByDateRouteDealerSales  = (data, date, route,dealer,selectedValue) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.Region.toLowerCase() === route.toLowerCase()
            && obj.customer_name.toLowerCase() === dealer.toLowerCase()
            
            // && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            && obj.SalesPerson.toLowerCase() === selectedValue.toLowerCase()
    );
};
 
 


export const filterByDateRouteDealerSales = (data, date, route,dealer,selectedValue) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.Customer_Name.toLowerCase() === dealer.toLowerCase()
            && obj.REGION.toLowerCase() === route.toLowerCase()
            // && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            && obj.SalesPerson.toLowerCase() === selectedValue.toLowerCase()
    );
};

export const filterByDateDealerProductSales= (data, date, dealer,product,selectedValue) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.Customer_Name.toLowerCase() === dealer.toLowerCase()
            // && obj.REGION.toLowerCase() === route.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            && obj.SalesPerson.toLowerCase() === selectedValue.toLowerCase()
    );
};

export const lowerfilterByDateDealerProductSales = (data, date, dealer,product,selectedValue) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.customer_name.toLowerCase() === dealer.toLowerCase()
            // && obj.Region.toLowerCase() === route.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            && obj.SalesPerson.toLowerCase() === selectedValue.toLowerCase()
    );
};
 

export const filterByDateRouteDProductsales = (data, date, route,product,selectedValue) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            // && obj.Customer_Name.toLowerCase() === dealer.toLowerCase()
            && obj.REGION.toLowerCase() === route.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            && obj.SalesPerson.toLowerCase() === selectedValue.toLowerCase()
    );
};

export const lowerfilterByDateRouteDProductsales = (data, date, route,product,selectedValue) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            // && obj.customer_name.toLowerCase() === dealer.toLowerCase()
            && obj.Region.toLowerCase() === route.toLowerCase()
            && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            && obj.SalesPerson.toLowerCase() === selectedValue.toLowerCase()
    );
};
 
 //----------- Product---


 export const filterByDateRouteDealerSalesman = (data, date,dealer, route,SalesPerson)=>{
    return dateFormationDataKey(data).filter(
        obj => obj.BADAT_Requisition_Request_Date === date
            && obj.customer_name.toLowerCase() === dealer.toLowerCase()
            && obj.Region.toLowerCase() === route.toLowerCase()
            // && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            && obj.SalesPerson.toLowerCase() === SalesPerson.toLowerCase()
    );

 }

 export const filterByDateRouteDealerSalesmanForecast  = (data, date, route,dealer,SalesPerson) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            && obj.Customer_Name.toLowerCase() === dealer.toLowerCase()
            && obj.REGION.toLowerCase() === route.toLowerCase()
            // && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            && obj.SalesPerson.toLowerCase() === SalesPerson.toLowerCase()
    );
};

export const filterByDatesales  = (data, date) => {
    return dateFormationDataKey(data).filter(
        obj => obj.Date_Module === date
            // && obj.Customer_Name.toLowerCase() === dealer.toLowerCase()
            // && obj.REGION.toLowerCase() === route.toLowerCase()
            // && obj.MATKL_Material_Category.toLowerCase() === product.toLowerCase()
            // && obj.SalesPerson.toLowerCase() === SalesPerson.toLowerCase()
    );
};