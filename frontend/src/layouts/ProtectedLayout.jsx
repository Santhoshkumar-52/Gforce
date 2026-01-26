import { Navigate, Outlet } from "react-router-dom";
import useStore from "../store/useStore.js";
import Sidebar from "../components/Sidebar.jsx";

const ProtectedLayout = () => {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  } else {
    <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          margin: "20px",
          overflow: "auto",
          position: "relative", // ⭐ IMPORTANT
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
