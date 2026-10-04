import { authApi } from './axiosconfig';

const authService = {
    signIn: async (username, password) => {
        const response = await authApi.post('/signin', {username, password});
        return response.data.data;
    },

    signUp: async (userData) => {
        const response = await authApi.post('/signup', userData);
        return response.data.data;
    }
}

export default authService;