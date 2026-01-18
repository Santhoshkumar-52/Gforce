import { create } from 'zustand'
import { baseUrl } from '../../defaultvalues';

const useStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || false,
    branchid: localStorage.getItem("branchid") || '',
    baseUrl: baseUrl,

    saveUser: (userData) => {
        localStorage.setItem('user', JSON.stringify(userData)),
            localStorage.setItem('branchid', userData.staff.branchId),
            set({
                user: userData,
                branchid: userData.staff.branchid
            })
    },
    logout: () => {
        localStorage.clear()
        set({
            user: false
        })
    }
}))


export default useStore;
