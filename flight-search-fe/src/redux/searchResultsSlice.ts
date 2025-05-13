import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface Flight {
  id: string;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  duration: string;
  airline: string;
  stops: string;
  currency: string;
  price: number;
  pricePerPerson: number;
}

interface SearchResultsState {
  results: Flight[];
}

const initialState: SearchResultsState = {
  results: [],
};

const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState,
  reducers: {
    setSearchResults(state, action: PayloadAction<Flight[]>) {
      state.results = action.payload;
    },
  },
});

export const { setSearchResults } = searchResultsSlice.actions;
export default searchResultsSlice.reducer;
