import { create } from "zustand";
import { job } from "../integration/job";

const useJobStore = create((set, get) => ({
    data: [],
    loading: false,
    error: null,

    findAll: async () => {
        set({ loading: true });
        try {
            const response = await job.findAll();
            set({ data: response || [], loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    createJob: async (title, position, description, criteria) => {
        set({ loading: true });
        try {
            const response = await job.create(title, position, description, criteria);
            if (response.status !== "error") {
                await get().findAll();
            }
            set({ loading: false });
            return response
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    deleteJob: async (id) => {
        set({ loading: true });
        try {
            const response = await job.delete(id);
            if (response.status !== "error") {
                await get().findAll();
            }
            set({ loading: false });
            return response
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    editJob: async (id, title, position, description, criteria) => {
        set({ loading: true });
        const response = await job.update(id, title, position, description, criteria);
        if (response.status !== "error") {
            await get().findAll();
        }
        set({ loading: false });
        return response;
    },
}))


export default useJobStore