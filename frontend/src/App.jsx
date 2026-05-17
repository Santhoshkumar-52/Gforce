import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

import useStore from "./store/useStore.js";

import ProtectedLayout from "./layouts/ProtectedLayout";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login.jsx";
import Member from "./pages/Member.jsx";
import Sales from "./pages/Sales.jsx";
import InvoiceBill from "./components/InvoiceBill.jsx";
import Memberattendance from "./pages/Memberattendance.jsx";
import Admin from "./pages/Admin.jsx";
import Trainers from "./subpages/admin/Trainer.jsx";
import Reports from "./pages/Reports.jsx";
import SaleReport from "./subpages/reports/SaleReport.jsx";
import AttendanceReport from "./subpages/reports/AttendanceReport.jsx";
import Plans from "./subpages/admin/Plans.jsx";
import GST from "./subpages/admin/GST.jsx";
import Discount from "./subpages/admin/Discount.jsx";
import Branch from "./subpages/admin/Branch.jsx";

const App = () => {
  const bootstrapApp = useStore((state) => state.bootstrapApp);

  const isAppReady = useStore((state) => state.isAppReady);

  const user = useStore((state) => state.user);

  // ─────────────────────────────────────────
  // APP BOOTSTRAP
  // ─────────────────────────────────────────
  useEffect(() => {
    const initializeApp = async () => {
      // SHOW LOADING
      Swal.fire({
        title: "Initializing Application",
        text: "Loading workspace data...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // LOAD GLOBAL DATA
      await bootstrapApp();

      // CLOSE LOADING
      Swal.close();
    };

    initializeApp();
  }, []);

  // ─────────────────────────────────────────
  // BLOCK RENDER UNTIL READY
  // ─────────────────────────────────────────
  if (!isAppReady) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN ROUTE */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          element={user ? <ProtectedLayout /> : <Navigate to="/" replace />}
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/member" element={<Member />} />

          <Route path="/sales" element={<Sales />} />

          <Route path="/admin" element={<Admin />} />

          <Route path="/admin/trainers" element={<Trainers />} />

          <Route path="/admin/plans" element={<Plans />} />

          <Route path="/admin/GST" element={<GST />} />

          <Route path="/admin/discount" element={<Discount />} />

          <Route path="/admin/branch" element={<Branch />} />

          <Route path="/m_attendance" element={<Memberattendance />} />

          <Route path="/reports" element={<Reports />} />

          <Route path="/reports/sales" element={<SaleReport />} />

          <Route path="/reports/m_attendance" element={<AttendanceReport />} />

          <Route
            path="/sales/invoice/:saleUniqueId"
            element={<InvoiceBill />}
          />
        </Route>

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
