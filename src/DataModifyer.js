


export const DataModifyer =()=>{

}

export const modifyData = (inputData) => {
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

export const getModifiedEntries = (entries) => {
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