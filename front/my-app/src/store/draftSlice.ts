import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { logout } from './authSlice';

// Тип элемента в корзине (подсмотри в Swagger HandlerCartIconResponse или MixingList)
// Пока сделаем any, чтобы заработало


export const fetchMixing = createAsyncThunk('draft/fetch', async () => {
  const res = await api.mixing.mixingList();
  return res.data; 
});

export const addToMixing = createAsyncThunk('draft/add', async (params: { element_id: number, volume: number }) => {
  await api.mixing.itemsCreate(params);
  
});

export const removeFromMixing = createAsyncThunk('draft/remove', async (element_id: number) => {
  await api.mixing.removeCreate({ element_id });
});

const MixingSlice = createSlice({
  name: 'draft',
  initialState: { items: [] as any[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMixing.fulfilled, (state, action) => {
      // Подстрой под структуру ответа: action.payload.data или items
      state.items = (action.payload as any).items ?? [];
    });
    // При logout очищаем черновик
    builder.addCase(logout.fulfilled, (state) => {
      state.items = [];
    });
  }
});

export const MixingReducer = MixingSlice.reducer;
