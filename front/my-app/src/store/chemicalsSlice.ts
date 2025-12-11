
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getChemicals } from '../modules/chemistryApi';
import type { ChemicalElement } from '../types/chemistry';

export const fetchChemicals = createAsyncThunk<
  ChemicalElement[],
  string | undefined
>('chemicals/fetchChemicals', async (query) => {
  const data = await getChemicals(query);
  return data;
});

interface ChemicalsState {
  items: ChemicalElement[];
  loading: boolean;
  error: string | null;
}

const initialState: ChemicalsState = {
  items: [],
  loading: false,
  error: null,
};

const chemicalsSlice = createSlice({
  name: 'chemicals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChemicals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChemicals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchChemicals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  },
});

export const chemicalsReducer = chemicalsSlice.reducer;
