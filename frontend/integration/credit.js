import { api } from "./api"

export const credit = {
    find : async () =>{
        return await api.get("/subscriptions/credit")
    }
}