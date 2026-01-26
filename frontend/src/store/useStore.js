import { create } from 'zustand'
import { baseUrl } from '../../defaultvalues';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

function decodeIfExists(token) {
    if (token) {
        const { data } = jwtDecode(token)
        return data
    }
    return []
}

let getsavedclientid = localStorage.getItem('clientid')
let getsaveddiscountid = localStorage.getItem('discountids')
let getsavedgstid = localStorage.getItem('gstids')
let getsavedstaffid = localStorage.getItem('staffid')
let getsavedplanid = localStorage.getItem('planid')


// getsavedclientid = ;
// getsaveddiscountid = ;
// getsavedgstid =;
// getsavedstaffid = ;
// getsavedplanid = ;

const useStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem("user")) || false,
    branchid: localStorage.getItem("branchid") || '',
    baseUrl: baseUrl,
    branchids: getsavedclientid && decodeIfExists(getsavedclientid) || [],
    discountids: getsaveddiscountid && decodeIfExists(getsaveddiscountid) || [],
    gstvalues: getsavedgstid && decodeIfExists(getsavedgstid) || [],
    plans: getsavedplanid && decodeIfExists(getsavedplanid) || [],
    staffs: getsavedstaffid && decodeIfExists(getsavedstaffid) || [],
    priceformat: "₹",




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
    },
    setclientids: async () => {
        try {
            if (get().branchids?.length > 0) return;
            const { user } = get();
            const response = await axios.post(`${baseUrl}/api/commonvalue/clientid`, { branchid: user.staff.branchId, groupid: user.group._id });
            let clientids = response.data.branchid;
            localStorage.setItem('clientid', clientids)
            clientids = decodeIfExists(clientids)
            set({
                branchids: clientids
            });
        } catch (err) {
            console.error("Error fetching client IDs:", err);
            set({ branchids: [] });
        }
    },
    setdicountids: async () => {
        try {
            if (get().discountids?.length > 0) return;
            const { user } = get();
            const response = await axios.post(`${baseUrl}/api/commonvalue/discountid`, { branchid: user.staff.branchId, groupid: user.group._id });
            let discountids = response.data.discountcategoryid;
            localStorage.setItem('discountids', discountids)
            discountids = decodeIfExists(discountids)
            set({
                discountids: discountids
            });
        } catch (err) {
            console.error("Error fetching client IDs:", err);
            set({ discountids: [] });
        }
    },
    setgstids: async () => {
        try {
            if (get().gstvalues?.length > 0) return;
            const { user } = get();
            const response = await axios.post(`${baseUrl}/api/commonvalue/gstid`, { branchid: user.staff.branchId, groupid: user.group._id });
            let gst = response.data.gstids;
            localStorage.setItem('gstids', gst)
            gst = decodeIfExists(gst)
            set({
                gstvalues: gst
            });
        } catch (err) {
            console.error("Error fetching client IDs:", err);
            set({ gstvalues: [] });
        }
    },
    setstaff: async () => {
        try {
            if (get().staffs?.length > 0) return;
            const { user } = get();
            const response = await axios.post(`${baseUrl}/api/commonvalue/staffid`, { branchid: user.staff.branchId, groupid: user.group._id });
            let staff = response.data.staffids;
            localStorage.setItem('staffid', staff)
            staff = decodeIfExists(staff)
            set({
                staffs: staff
            });
        } catch (err) {
            console.error("Error fetching client IDs:", err);
            set({ staffs: [] });
        }
    },
    setplanids: async () => {
        try {
            if (get().plans?.length > 0) return;
            const { user } = get();
            const response = await axios.post(`${baseUrl}/api/commonvalue/planid`, { branchid: user.staff.branchId, groupid: user.group._id });
            let plan = response.data.planids;
            localStorage.setItem('planid', plan)
            plan = decodeIfExists(plan)
            set({
                plans: plan
            });
        } catch (err) {
            console.error("Error fetching client IDs:", err);
            set({ plans: [] });
        }
    },
    handledate: (duration) => {
        const formatDate = (date) => date.toISOString().split("T")[0];

        const today = new Date();
        let startdate = "";
        let enddate = "";

        switch (duration) {
            case "today":
                startdate = formatDate(today);
                enddate = formatDate(today);
                break;

            case "ytdy": {
                const ytdy = new Date(today);
                ytdy.setDate(ytdy.getDate() - 1);
                startdate = formatDate(ytdy);
                enddate = formatDate(ytdy);
                break;
            }

            case "last7": {
                const start = new Date(today);
                start.setDate(start.getDate() - 6);
                startdate = formatDate(start);
                enddate = formatDate(today);
                break;
            }

            case "last14": {
                const start = new Date(today);
                start.setDate(start.getDate() - 13);
                startdate = formatDate(start);
                enddate = formatDate(today);
                break;
            }

            case "month": {
                const start = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                );
                startdate = formatDate(start);
                enddate = formatDate(today);
                break;
            }

            // 🔹 If duration itself is a date (custom / picker)
            default: {
                startdate = formatDate(new Date(duration));
                enddate = formatDate(today);
                break;
            }
        }

        return { startdate, enddate };
    }
}))


export default useStore;
