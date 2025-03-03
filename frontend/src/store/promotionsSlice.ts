import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.API_URL;

export interface Promotion {
  _id?: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  expectedSalesImpact?: number;
}

interface PromotionsState {
  items: Promotion[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  dateFilter: {
    startDate: string | null;
    endDate: string | null;
  };
}

const initialState: PromotionsState = {
  items: [],
  status: 'idle',
  error: null,
  dateFilter: {
    startDate: null,
    endDate: null,
  },
};

export const fetchPromotions = createAsyncThunk('promotions/fetchPromotions', async () => {
  const response = await axios.get(`${API_URL}/promotions`);
  return response.data;
});

export const addPromotion = createAsyncThunk(
  'promotions/addPromotion',
  async (promotion: Promotion) => {
    const response = await axios.post(`${API_URL}/promotions`, promotion);
    return response.data;
  }
);

export const updatePromotion = createAsyncThunk(
  'promotions/updatePromotion',
  async (promotion: Promotion) => {
    const response = await axios.put(`${API_URL}/promotions/${promotion._id}`, promotion);
    return response.data;
  }
);

export const deletePromotion = createAsyncThunk(
  'promotions/deletePromotion',
  async (id: string) => {
    await axios.delete(`${API_URL}/promotions/${id}`);
    return id;
  }
);

const promotionsSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    setDateFilter: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null }>) => {
      state.dateFilter = action.payload;
    },
    clearDateFilter: (state) => {
      state.dateFilter = { startDate: null, endDate: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch promotions';
      })
      .addCase(addPromotion.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deletePromotion.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { setDateFilter, clearDateFilter } = promotionsSlice.actions;

export default promotionsSlice.reducer;