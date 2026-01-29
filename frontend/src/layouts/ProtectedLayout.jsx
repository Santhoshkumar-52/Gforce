import { Navigate, Outlet } from "react-router-dom";
import useStore from "../store/useStore.js";
import Sidebar from "../components/Sidebar.jsx";
import { useContext } from "react";
import CommonValueContext from "./CommonvalueContext.jsx";

const ProtectedLayout = () => {
  const user = useStore((state) => state.user);

  const store = useStore();

  if (!user) {
    return <Navigate to="/" replace />;
  } else {
    <Navigate to="/dashboard" replace />;
  }

  return (
    <CommonValueContext.Provider value={store}>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            margin: "20px",
            overflow: "auto",
            position: "relative",
          }}
        >
          <Outlet />
        </div>
      </div>
    </CommonValueContext.Provider>
  );
};

export default ProtectedLayout;
