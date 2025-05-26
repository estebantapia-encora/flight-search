import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Flight } from "../types/Flight";


interface SearchResultsState { results: Flight[]; }
interface Airport { cityName: string; iataCode: string;}
interface SearchResultsState { results: Flight[]; originAirport: Airport | null; destinationAirport: Airport | null; 
  selectedDeparture: Flight | null;  
  selectedReturn: Flight | null; 
}
const initialState: SearchResultsState = {
  results: [],
  originAirport: null,
  destinationAirport: null,
  selectedDeparture: null,
  selectedReturn: null,
};
const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState,
  reducers: {
    setSearchResults(state, action: PayloadAction<Flight[]>) {
      state.results = action.payload;
    },
    setOriginAirport(state, action: PayloadAction<Airport>) {
      state.originAirport = action.payload;
    },
    setDestinationAirport(state, action: PayloadAction<Airport>) {
      state.destinationAirport = action.payload;
    },
setSelectedDeparture(state, action: PayloadAction<Flight | null>) {
  state.selectedDeparture = action.payload;
},
setSelectedReturn(state, action: PayloadAction<Flight | null>) {
  state.selectedReturn = action.payload;
},
  },
});
export default searchResultsSlice.reducer;
export const {
  setSearchResults,
  setOriginAirport,
  setDestinationAirport,
  setSelectedDeparture,
  setSelectedReturn
} = searchResultsSlice.actions;