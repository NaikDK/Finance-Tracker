import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tradeReducer from './slices/tradeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        trades: tradeReducer
    }
});

export default store;