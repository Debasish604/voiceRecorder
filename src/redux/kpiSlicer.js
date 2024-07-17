import { createSlice } from '@reduxjs/toolkit'

export const KpISclicer = createSlice({
    name:"kpiapidata",
    initialState:{
        inventoryTrunover:[]
    },
    reducers:{
       inventoryTrunover : (state,action)=>{
        state.inventoryTrunover = action.payload
       }
    }
})

export const {inventoryTrunover}=KpISclicer.actions
export default KpISclicer.reducer