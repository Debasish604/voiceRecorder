import { configureStore } from  '@reduxjs/toolkit'
import KpISclicer from './redux/kpiSlicer'

export default configureStore({
    reducer:{
        kpiapidata:KpISclicer
    }
})