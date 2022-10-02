import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { isNotEmittedStatement } from 'typescript';
import termsReducer from './termsSlice';

export const store = configureStore({
  reducer: {
    terms: termsReducer
  },
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
