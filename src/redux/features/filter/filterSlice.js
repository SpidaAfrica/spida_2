import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  filteredProducts: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_PRODUCTS(state, action) {
      const { products, search } = action.payload;

      const tempProducts = products?.filter(
        (product) =>
          product?.name?.toLowerCase().includes(search.toLowerCase()) ||
          product?.category?.toLowerCase().includes(search.toLowerCase()) ||
          product?.sku?.includes(search.toLowerCase())
      );

      state.filteredProducts = tempProducts;
    },
  },
});

export const {
  FILTER_PRODUCTS
} = filterSlice.actions;

export const selectFilteredPoducts = (state) => state.filter.filteredProducts;

export default filterSlice.reducer;
