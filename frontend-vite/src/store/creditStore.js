import { create } from 'zustand';
import { credit } from '../integration/credit';

const useCreditStore = create((set) => ({
    credit : null,
    findCredit : async () => {
        try {
            const response = await credit.find();
            set({ credit: response.data.data });
        } catch (error) {
            set({ credit: null });
        }
    },
}))

export default useCreditStore;