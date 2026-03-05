import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* default redirect */}
        <Route path="/" element={<Login />} />

        {/* protected layout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/member" element={<Member />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/trainers" element={<Trainers />} />
          <Route path="/m_attendance" element={<Memberattendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/sales" element={<SaleReport />} />
          <Route
            path="/sales/invoice/:saleUniqueId"
            element={<InvoiceBill />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
