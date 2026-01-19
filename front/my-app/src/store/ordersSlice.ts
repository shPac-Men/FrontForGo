import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api'; // Убедись, что путь к api правильный

// Тип для заявки (подсмотри точные поля в Swagger, если они есть, или используй any пока что)
// Обычно там есть id, status, items, created_at
export interface Order {
  id: number;
  status: string;
  created_at?: string;
  items?: any[];
  [key: string]: any;
}

interface OrdersState {
  list: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  list: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// 1. Получение списка заявок (для обычных пользователей)

export const fetchMixed = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.mixed.getMixed();
      const data = response.data as any; 
      
    
      if (Array.isArray(data)) {
         return data as Order[];
      }

  
      return (data.items || data.data || []) as Order[];
      
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заявок');
    }
  }
);

// Получение списка всех заявок (для модератора/админа)
export const fetchAllMixed = createAsyncThunk(
  'orders/fetchAllOrders',
  async (filters: { status?: string; date_from?: string; date_to?: string } | undefined, { rejectWithValue }) => {
    try {
      const query: any = {};
      if (filters?.status) query.status = filters.status;
      if (filters?.date_from) query.date_from = filters.date_from;
      if (filters?.date_to) query.date_to = filters.date_to;
      
      const response = await api.admin.mixedList(query);
      const data = response.data as any;
      
      if (Array.isArray(data)) {
        return data as Order[];
      }
      
      return (data.items || data.data || []) as Order[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заявок');
    }
  }
);

// Обновление статуса заявки
export const updateMixedStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }: { orderId: number; status: string }, { rejectWithValue }) => {
    try {
      await api.admin.mixedUpdate(orderId, { status });
      return { orderId, status };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка обновления статуса');
    }
  }
);

// 2. Получение деталей одной заявки
export const fetchMixedDetail = createAsyncThunk(
  'orders/fetchOrderDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.mixed.getMixed2(id);
      // Аналогично, смотрим где лежит объект
      const data = response.data as any;
      return (data.data || data) as Order;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заявки');
    }
  }
);

const MixedsSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    // Список (обычные пользователи)
    builder.addCase(fetchMixed.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMixed.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(fetchMixed.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Список всех заявок (админ/модератор)
    builder.addCase(fetchAllMixed.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllMixed.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(fetchAllMixed.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Обновление статуса
    builder.addCase(updateMixedStatus.fulfilled, (state, action) => {
      const order = state.list.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    });

    // Детали
    builder.addCase(fetchMixedDetail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMixedDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
    });
    builder.addCase(fetchMixedDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentOrder } = MixedsSlice.actions;
export const ordersReducer = MixedsSlice.reducer;
