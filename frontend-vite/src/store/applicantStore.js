import { create } from 'zustand';
import { applicant } from '../integration/applicant';

const useApplicantStore = create((set, get) => ({
    data: [], 
    loading: false,
    error: null,

    findAll: async () => {
        set({ loading: true });
        try {
            const response = await applicant.findAll();
            set({ data: response.data.data || [], loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    removeApplicant: async (id) => {
        try {
            const res = await applicant.delete(id);
            if (res.status !== false) {
                const currentData = get().data;
                set({ data: currentData.filter(item => item.id !== id) });
                return { success: true };
            }
            return { success: false, message: "Gagal menghapus" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}));

export default useApplicantStore;