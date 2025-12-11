
import { configureStore } from '@reduxjs/toolkit';
import { filterReducer } from './filterSlice';
import { chemicalsReducer } from './chemicalsSlice';


export const store = configureStore({
  reducer: {
    filter: filterReducer,
    chemicals: chemicalsReducer,
  },
});

// Типы для useSelector/useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;