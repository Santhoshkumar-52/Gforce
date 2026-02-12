import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import useStore from "./store/useStore.js";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login.jsx";
import Member from "./pages/Member.jsx";
import Sales from "./pages/Sales.jsx";
import InvoiceBill from "./components/InvoiceBill.jsx";

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
