// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { filterReducer } from "./filterSlice";
import { chemicalsReducer } from "./chemicalsSlice";
import { ordersReducer } from "./ordersSlice";

import { authReducer } from "./authSlice";
import { MixingReducer } from "./draftSlice";


export const store = configureStore({
  reducer: {
    filter: filterReducer,
    chemicals: chemicalsReducer,
    auth: authReducer,
    draft: MixingReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
