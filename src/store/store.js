import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./wishlistSlice";
import cartReducer from "./cartSlice";
import continentReducer from "./continentSlice";
import countryReducer from "./countrySlice";
import stateReducer from "./stateSlice";
import cityReducer from "./citySlice";
import taxonomyReducer from "./taxonomySlice";
import placeReducer from "./placeSlice";
import selectionReducer from "./selectionSlice";
import userReducer from "./userSlice";


export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    cart: cartReducer,
    continents: continentReducer,
    countries: countryReducer,
    states: stateReducer,
    cities: cityReducer,
    taxonomy: taxonomyReducer,
    places: placeReducer,
    selection: selectionReducer,
    user: userReducer
  },
});
