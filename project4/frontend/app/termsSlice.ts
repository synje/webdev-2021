import React from 'react'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface TermsState {
    searchTerm: string;
    sortTerm: string;
    status: 'idle' | 'loading' | 'failed';
  }

const initialState: TermsState = {
    searchTerm: "",
    sortTerm: "",
    status: 'idle',
  };

  /**
   * Make reducers for searcTerm and sortTerm
   */
export const termsSlice = createSlice({
    name: 'terms',
    initialState,
    reducers:  {
        updateSearchTerm : (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload
        },
        updateSortTerm : (state, action: PayloadAction<string>) => {
            state.sortTerm = action.payload
        }
    }
})

export const {updateSortTerm, updateSearchTerm} = termsSlice.actions;
export const selectSearchTerm = (state: RootState) => state.terms.searchTerm
export const selectSortTerm = (state: RootState) => state.terms.sortTerm

export default termsSlice.reducer