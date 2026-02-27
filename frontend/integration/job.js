import { api } from "./api"

export const job = {
    findAll: async () => {
        const res = await api.get("/hr/jobs")
        return res.data.data
    },
    create: async (title, position, description, criteria) => {
        const res = await api.post("/hr/jobs", {
            title, position, description, criteria
        })
        return res.data 
    },
    delete : async (id) => {
        const res = await api.delete(`/jobs/${id}`)
        return res.data
    },
    update: async (id,title, position, description, criteria)=>{
        const res = await api.put(`/hr/jobs/${id}`,{
            title, position, description, criteria
        })
        return res.data 
    }
}