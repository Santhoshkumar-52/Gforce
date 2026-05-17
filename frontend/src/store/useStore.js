import { create } from "zustand";
import jwtDecode from "jwt-decode";
import api from "../services/apiService.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Decode a JWT from localStorage by key.
 * Returns the decoded .data payload, or fallback if missing/expired.
 */
function loadFromStorage(key, fallback = []) {
  const token = localStorage.getItem(key);
  if (!token) return fallback;
  try {
    const decoded = jwtDecode(token);
    // Respect JWT expiry — exp is in seconds
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem(key);
      return fallback;
    }
    return decoded.data ?? fallback;
  } catch {
    localStorage.removeItem(key); // corrupted token
    return fallback;
  }
}

/**
 * Generic fetch-and-cache helper used by all setter actions.
 * - Skips fetch if localStorage key already holds a valid, unexpired token.
 * - On success: stores JWT in localStorage and updates Zustand state.
 * - On failure: sets state to fallback silently (console.error only).
 *
 * @param {string}   storageKey   localStorage key
 * @param {string}   stateKey     Zustand state key to update
 * @param {Function} fetchFn      async () => { token, data } — returns the raw JWT token from API
 * @param {*}        fallback     value on error (default [])
 * @param {Function} set          Zustand set
 */
async function fetchAndCache({
  storageKey,
  stateKey,
  fetchFn,
  fallback = [],
  set,
}) {
  // Skip if cache is still valid
  if (loadFromStorage(storageKey, null) !== null) return;

  try {
    const token = await fetchFn();
    localStorage.setItem(storageKey, token);
    const data = jwtDecode(token).data;
    set({ [stateKey]: data });
  } catch (err) {
    console.error(`[store] Failed to fetch ${stateKey}:`, err);
    set({ [stateKey]: fallback });
  }
}

// ── Initial values from localStorage ─────────────────────────────────────────
const initialBranchids = loadFromStorage("branchids", []);
const initialDiscounts = loadFromStorage("discountids", []);
const initialGst = loadFromStorage("gstids", []);
const initialStaffs = loadFromStorage("staffid", []);
const initialPlans = loadFromStorage("planid", []);
const initialGroups = loadFromStorage("groupIds", []);
const initialBranchdata = loadFromStorage("branchdetails", null);

// ── Store ─────────────────────────────────────────────────────────────────────
const useStore = create((set, get) => ({
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || false,
  branchid: localStorage.getItem("branchid") || "",
  priceformat: "₹",

  branchids: initialBranchids,
  discountids: initialDiscounts,
  gstvalues: initialGst,
  staffs: initialStaffs,
  plans: initialPlans,
  groupid: initialGroups,
  branchdata: initialBranchdata,

  // ── Auth ──────────────────────────────────────────────────────────────────
  saveUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("branchid", userData.staff.branchId);
    set({ user: userData, branchid: userData.staff.branchId });
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  logout: () => {
    localStorage.clear();
    set({ user: false });
  },

  // ── Common value setters (all use fetchAndCache) ──────────────────────────
  setclientids: async () => {
    const { user } = get();
    await fetchAndCache({
      storageKey: "branchids",
      stateKey: "branchids",
      fetchFn: async () => {
        const res = await api.post("/commonvalue/clientid", {
          branchid: user.staff.branchId,
          groupid: user.group._id,
        });
        return res.data.branchid;
      },
      set,
    });
  },

  setdicountids: async () => {
    const { user } = get();
    await fetchAndCache({
      storageKey: "discountids",
      stateKey: "discountids",
      fetchFn: async () => {
        const res = await api.post("/commonvalue/discountid", {
          branchid: user.staff.branchId,
          groupid: user.group._id,
        });
        return res.data.discountcategoryid;
      },
      set,
    });
  },

  setgstids: async () => {
    const { user } = get();
    await fetchAndCache({
      storageKey: "gstids",
      stateKey: "gstvalues",
      fetchFn: async () => {
        const res = await api.post("/commonvalue/gstid", {
          branchid: user.staff.branchId,
          groupid: user.group._id,
        });
        return res.data.gstids;
      },
      set,
    });
  },

  setstaff: async () => {
    const { user } = get();
    await fetchAndCache({
      storageKey: "staffid",
      stateKey: "staffs",
      fetchFn: async () => {
        const res = await api.post("/commonvalue/staffid", {
          branchid: user.staff.branchId,
          groupid: user.group._id,
        });
        return res.data.staffids;
      },
      set,
    });
  },

  setplanids: async () => {
    const { user } = get();
    await fetchAndCache({
      storageKey: "planid",
      stateKey: "plans",
      fetchFn: async () => {
        const res = await api.post("/commonvalue/planid", {
          branchid: user.staff.branchId,
          groupid: user.group._id,
        });
        return res.data.planids;
      },
      set,
    });
  },

  getbranchdetails: async () => {
    const { branchid } = get();
    await fetchAndCache({
      storageKey: "branchdetails",
      stateKey: "branchdata",
      fallback: null,
      fetchFn: async () => {
        const res = await api.post("/commonvalue/getbranchdetails", {
          branchid,
        });
        return res.data.branchdata;
      },
      set,
    });
  },

  getGroupIds: async () => {
    await fetchAndCache({
      storageKey: "groupIds",
      stateKey: "groupid",
      fetchFn: async () => {
        const res = await api.post("/commonvalue/getgroupids");
        return res.data.groupIds;
      },
      set,
    });
  },
}));

export default useStore;
