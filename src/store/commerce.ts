import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Router from 'next/router';

import api from '../services/api';
import { ICommerceResponse } from '../types';

interface CommerceState {
  loading: boolean;
  data: ICommerceResponse | null;
  error: string | undefined;
}

const initialState: CommerceState = {
  loading: false,
  data: null,
  error: ''
};

export const getCommerces = createAsyncThunk(
  'admin/getCommerces',
  (endpoint: string) => {
    const token = localStorage.getItem('admin-token');

    if (!token) {
      return Router.push('/admin/login');
    }

    return api
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        return res.data;
      })
      .catch(res => {
        if (res.response.status === 401) {
          localStorage.removeItem('admin-token');
          Router.push('/admin/login');
          return [];
        }
      });
  }
);

export const commerceSlice = createSlice({
  name: 'commerce',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getCommerces.pending, state => {
      state.loading = true;
    });
    builder.addCase(getCommerces.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getCommerces.rejected, (state, action) => {
      state.loading = false;
      state.data = null;
      state.error = action.error.message;
    });
  }
});

// export const {} = commerceSlice.actions;

export default commerceSlice.reducer;
