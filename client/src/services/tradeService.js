import {tradeApi} from './axiosconfig';

const tradeService = {
    getAllTrades: async () => {
        const response = await tradeApi.get('/all');
        return response.data.data;
    },

    getOpenTrades: async () => {
        const response = await tradeApi.get('/open');
        return response.data.data;
    },

    getClosedTrades: async () => {
        const response = await tradeApi.get('/closed');
        return response.data.data;
    },

    getTradesByTicker: async (ticker) => {
        const response = await tradeApi.get('/ticker/${ticker}');
        return response.data.data;
    },

    getTradeById: async (id) => {
        const response = await tradeApi.get('/${id');
        return response.data.data;
    },

    createTrade: async (tradeData) => {
        const response = await tradeApi.post('/create', tradeData);
        return response.data.data;
    },

    closeTrade: async (id, tradeData) => {
        const response = await tradeApi.post('/close/${id}', tradeData);
        return response.data.data;
    },

    getPortfolioSummary: async () => {
        const response = await tradeApi.get('/portfolio');
        return response.data.data;
    }
};

export default tradeService;