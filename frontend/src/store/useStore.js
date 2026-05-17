import { create } from "zustand";
import jwtDecode from "jwt-decode";
import api from "../services/apiService.js";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function decodeToken(token, fallback = null) {
  if (!token) return fallback;

  try {
    const decoded = jwtDecode(token);

    // JWT expiry check
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return fallback;
    }

    return decoded.data ?? fallback;
  } catch {
    return fallback;
  }
}

// ─────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────

const useStore = create((set, get) => ({
  // ─────────────────────────────────────────
  // AUTH STATE
  // ─────────────────────────────────────────

  token: localStorage.getItem("token") || null,

  user: JSON.parse(localStorage.getItem("user")) || null,

  branchid: localStorage.getItem("branchid") || "",

  // ─────────────────────────────────────────
  // COMMON MASTER DATA
  // ─────────────────────────────────────────

  branchids: [],
  discountids: [],
  gstvalues: [],
  staffs: [],
  plans: [],
  groupid: [],
  branchdata: null,

  // ─────────────────────────────────────────
  // APP STATE
  // ─────────────────────────────────────────

  isBootstrapping: false,
  isAppReady: false,

  // ─────────────────────────────────────────
  // AUTH ACTIONS
  // ─────────────────────────────────────────

  saveUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("branchid", userData.staff.branchId);

    set({
      user: userData,
      branchid: userData.staff.branchId,
    });
  },

  setToken: (token) => {
    localStorage.setItem("token", token);

    set({
      token,
    });
  },

  logout: () => {
    localStorage.clear();

    set({
      token: null,
      user: null,
      branchid: "",

      branchids: [],
      discountids: [],
      gstvalues: [],
      staffs: [],
      plans: [],
      groupid: [],
      branchdata: null,
    });
  },

  // ─────────────────────────────────────────
  // FETCHERS
  // ─────────────────────────────────────────

  fetchBranchIds: async () => {
    const { user } = get();

    const res = await api.post("/commonvalue/clientid", {
      branchid: user.staff.branchId,
      groupid: user.group._id,
    });

    const token = res.data.branchid;

    localStorage.setItem("branchids", token);

    set({
      branchids: decodeToken(token, []),
    });
  },

  fetchDiscountIds: async () => {
    const { user } = get();

    const res = await api.post("/commonvalue/discountid", {
      branchid: user.staff.branchId,
      groupid: user.group._id,
    });

    const token = res.data.discountcategoryid;

    localStorage.setItem("discountids", token);

    set({
      discountids: decodeToken(token, []),
    });
  },

  fetchGstIds: async () => {
    const { user } = get();

    const res = await api.post("/commonvalue/gstid", {
      branchid: user.staff.branchId,
      groupid: user.group._id,
    });

    const token = res.data.gstids;

    localStorage.setItem("gstids", token);

    set({
      gstvalues: decodeToken(token, []),
    });
  },

  fetchStaffs: async () => {
    const { user } = get();

    const res = await api.post("/commonvalue/staffid", {
      branchid: user.staff.branchId,
      groupid: user.group._id,
    });

    const token = res.data.staffids;

    localStorage.setItem("staffid", token);

    set({
      staffs: decodeToken(token, []),
    });
  },

  fetchPlans: async () => {
    const { user } = get();

    const res = await api.post("/commonvalue/planid", {
      branchid: user.staff.branchId,
      groupid: user.group._id,
    });

    const token = res.data.planids;

    localStorage.setItem("planid", token);

    set({
      plans: decodeToken(token, []),
    });
  },

  fetchGroups: async () => {
    const res = await api.post("/commonvalue/getgroupids");

    const token = res.data.groupIds;

    localStorage.setItem("groupIds", token);

    set({
      groupid: decodeToken(token, []),
    });
  },

  fetchBranchDetails: async () => {
    const { branchid } = get();

    const res = await api.post("/commonvalue/getbranchdetails", {
      branchid,
    });

    const token = res.data.branchdata;

    localStorage.setItem("branchdetails", token);

    set({
      branchdata: decodeToken(token, null),
    });
  },

  // ─────────────────────────────────────────
  // BOOTSTRAP APP
  // ─────────────────────────────────────────

  bootstrapApp: async () => {
    const { token, user } = get();

    // NO LOGIN
    if (!token || !user) {
      set({
        isAppReady: true,
      });

      return;
    }

    set({
      isBootstrapping: true,
    });

    try {
      // ─────────────────────────────────────
      // HYDRATE FROM CACHE
      // ─────────────────────────────────────

      set({
        branchids: decodeToken(localStorage.getItem("branchids"), []),

        discountids: decodeToken(localStorage.getItem("discountids"), []),

        gstvalues: decodeToken(localStorage.getItem("gstids"), []),

        staffs: decodeToken(localStorage.getItem("staffid"), []),

        plans: decodeToken(localStorage.getItem("planid"), []),

        groupid: decodeToken(localStorage.getItem("groupIds"), []),

        branchdata: decodeToken(localStorage.getItem("branchdetails"), null),
      });

      // ─────────────────────────────────────
      // FETCH ONLY MISSING VALUES
      // ─────────────────────────────────────

      const promises = [];

      if (!get().branchids.length) {
        promises.push(get().fetchBranchIds());
      }

      if (!get().discountids.length) {
        promises.push(get().fetchDiscountIds());
      }

      if (!get().gstvalues.length) {
        promises.push(get().fetchGstIds());
      }

      if (!get().staffs.length) {
        promises.push(get().fetchStaffs());
      }

      if (!get().plans.length) {
        promises.push(get().fetchPlans());
      }

      if (!get().groupid.length) {
        promises.push(get().fetchGroups());
      }

      if (!get().branchdata) {
        promises.push(get().fetchBranchDetails());
      }

      // PARALLEL FETCH
      await Promise.all(promises);

      set({
        isAppReady: true,
      });
    } catch (err) {
      console.error("Bootstrap failed:", err);

      set({
        isAppReady: true,
      });
    } finally {
      set({
        isBootstrapping: false,
      });
    }
  },
}));

export default useStore;
