import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Router from 'next/router';
import api from '../services/api';

interface CommerceFormState {
  category: string;
  contact: {
    whatsapp: string;
    phone: string;
    email: string;
    instagram?: string;
    facebook?: string;
  };
  address: {
    city: string;
    complement: string;
    number: string;
    street: string;
    neighborhood: string;
    state: string;
    cep: string;
  };
  name: string;
  error?: string;
  loading?: boolean;
}

const initialState: CommerceFormState = {
  name: '',
  category: '',
  contact: {},
  address: {}
} as CommerceFormState;

export const postCommerce = createAsyncThunk(
  'admin/postCommerce',
  (body: CommerceFormState) => {
    const token = localStorage.getItem('admin-token');

    if (!token) {
      return Router.push('/admin/login');
    }

    return api
      .post('/commerce', body, {
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
          return;
        }
        return res.response.data;
      });
  }
);

export const commerceFormSlice = createSlice({
  name: 'commerceForm',
  initialState,
  reducers: {
    handleChangeFormData(state, action) {
      const { name, category, contact, address } = action.payload;

      if (name) {
        state.name = name;
      }
      if (category) {
        state.category = category;
      }
      if (contact) {
        state.contact = contact;
      }
      if (address) {
        state.address = address;
      }
    },
    resetFormData: () => initialState
  }
});

export const {
  handleChangeFormData,
  resetFormData
} = commerceFormSlice.actions;

export default commerceFormSlice.reducer;
