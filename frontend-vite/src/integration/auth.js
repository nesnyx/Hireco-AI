import { api } from "./api";

export const authentication = {
    login: async ( email, password ) => {
        return await api.post("/auth/login", { email, password });
    },
    register : async ( email, password, name ) => {
        return await api.post("/auth/register", { email, password, name });
    },
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/auth';
    },
    me :async () => {
        const response = await api.get('/auth/me');
        return response.data.data;
    }
}