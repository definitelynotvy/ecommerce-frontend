import axios from "axios";
import baseURL from "../../../utils/baseURL";
const {createAsyncThunk, createSlice} = require("@reduxjs/toolkit");

// initialState
const initialState={
    products:[],
    product:{}, loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDelete: false,
};

//create product action
export const createProductAction = createAsyncThunk(
    'product/create',
    async(payload, {rejectWithValue, getState, dispatch})=>{
        try{
            const{
                name,description,category,sizes,brand,colors,price}=payload;
            //make request
            const token =getState().users?.userAuth?.userInfo?.token;
            const config ={
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            };
            //Token - authenticated
            //Images

            const {data} = await axios.post(`${baseURL}/products`,{
                name,description,category,sizes,brand,colors,price,
            },config
            );
            return data;
        } catch(error){
            return rejectWithValue(error?.response?.data);
        }
    }
);

//slice
const productSlice = createSlice({
    name:"products",
    initialState,
    extraReducers:(builder)=>{
        //create
        builder.addCase(createProductAction.pending,(state)=>{
            state.loading=true;
        });
        builder.addCase(createProductAction.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload;
            state.isAdded=true;
        });
        builder.addCase(createProductAction.rejected,(state,action)=>{
            state.loading=false;
            state.products=null;
            state.isAdded=false;
            state.error=action.payload;
        });
    },
});

//generate the reducer
const productReducer = productSlice.reducer;

export default productReducer;