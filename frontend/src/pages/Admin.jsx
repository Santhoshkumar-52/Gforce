import "../styles/admin.css";
import { useNavigate } from "react-router-dom";
import adminBg from "../assets/admin.png";
import { FaDumbbell, FaCog } from "react-icons/fa";

const adminModules = [
  {
    name: "Trainers",
    icon: <FaDumbbell size={26} />,
    path: "/admin/trainers",
  },
  {
    name: "Settings",
    icon: <FaCog size={26} />,
    path: "/admin/settings",
  },
];

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-wrapper p-8"
      style={{ backgroundImage: `url(${adminBg})` }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-light)" }}>
          Manage your system modules
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {adminModules.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="admin-card cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center"
          >
            <div className="text-green-600">{item.icon}</div>
            <p className="mt-3 text-sm font-semibold text-gray-800 text-center">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
