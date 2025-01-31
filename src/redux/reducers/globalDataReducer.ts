import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalDataState {
  categories: any[]; 
  countries: any[]; 
}

 const initialState: GlobalDataState = {
  categories: [],
  countries: [],
};

 const globalDataSlice = createSlice({
  name: "globalData",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<any[]>) {
      state.categories = action.payload;
    },
    setCountries(state, action: PayloadAction<any[]>) {
      state.countries = action.payload;
    },
    addCategory(state, action: PayloadAction<{ name: string }>) {
      state.categories = [...state.categories, action.payload];
    },
    editCategory(state, action: PayloadAction<{ id: number; name: string }>) {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index].name = action.payload.name;
      }
    },
  },
});

export const { setCategories, setCountries, addCategory, editCategory } = globalDataSlice.actions;

export default globalDataSlice.reducer;
