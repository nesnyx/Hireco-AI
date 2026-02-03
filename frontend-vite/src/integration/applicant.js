import { api } from "./api";

export const applicant = {
    findAll : async () =>{
        return await api.get('/applicant');
    },
    delete: async (id) =>{
        return await api.delete(`/applicant/${id}`);
    }
}