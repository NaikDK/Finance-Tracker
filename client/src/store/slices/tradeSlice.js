import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tradeService from '../../services/tradeService';

export const fetchAllTrades = createAsyncThunk(
    'trades/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await tradeService.getAllTrades();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch trades');
        }
    }
);

export const fetchPortfolioSummary = createAsyncThunk(
    'trades/fetchPortfolio',
    async (_, { rejectWithValue }) => {
        try{
            return await tradeService.getPortfolioSummary();
        }catch(error){
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch portfolio');
        }
    }
);

export const createTrade = createAsyncThunk(
    'trades/createTrade',
    async (tradeData, { rejectWithValue }) => {
        try{
            return await tradeService.createTrade(tradeData);
        }catch(error){
            return rejectWithValue(error.response?.data?.message || 'Filed to create trade');
        }
    }
);

export const closeTrade = createAsyncThunk(
    'trade/closeTrade',
    async ({ id, closeData }, { rejectWithValue }) => {
        try{
            return await tradeService.closeTrade(id, closeData);
        }catch(error){
            rejectWithValue(error.response?.data?.message || 'Failed to close trade');
        }
    }
);

const initialState = {
    trades: [],
    portfolio: null,
    selectedTrade: null,
    loading: false,
    portfolioLoading: false,
    error: null,
    successMessage: null
}

const tradeSlice = createSlice({
    name: 'trades',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
        clearSuccess: (state) => { state.successMessage = null; },
        setSelectedTrade: (state, action) => { state.selectedTrade = action.payload; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTrades.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTrades.fulfilled, (state, action) => {
                state.loading = false;
                state.trades = action.payload;
            })
            .addCase(fetchAllTrades.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPortfolioSummary.pending, (state) => {
                state.portfolioLoading = true;
            })
            .addCase(fetchPortfolioSummary.fulfilled, (state, action) => {
                state.portfolioLoading = false;
                state.portfolio = action.payload;
            })
            .addCase(fetchPortfolioSummary.rejected, (state, action) => {
                state.portfolioLoading = false;
                state.error = action.payload;
            })

            .addCase(createTrade.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTrade.fulfilled, (state, action) => {
                state.loading = false;
                state.trades = [action.payload, ...state.trades];
                state.successMessage = 'Trade created successfully';
            })
            .addCase(createTrade.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(closeTrade.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(closeTrade.fulfilled, (state, action) => {
                state.loading = false;
                state.trades = state.trades.map(t => 
                    t.id === action.payload.id ? action.payload : t
                );
                state.successMessage = 'Trade closed successfully';
            })
            .addCase(closeTrade.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { clearError, clearSuccess, setSelectedTrade } = tradeSlice.actions;

export default tradeSlice.reducer;