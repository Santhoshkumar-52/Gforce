import "../styles/reports.css";
import { useNavigate } from "react-router-dom";
import reportsBg from "../assets/reports.png";
import { FaDumbbell, FaChartLine, FaUserCheck, FaUsers } from "react-icons/fa";

const reportModules = [
  {
    name: "Revenue Analytics",
    icon: <FaChartLine size={26} />,
    path: "/reports/sales",
  },
  {
    name: "Attendance Insights",
    icon: <FaUserCheck size={26} />,
    path: "/reports/m_attendance",
  },
  {
    name: "Trainer Performance",
    icon: <FaDumbbell size={26} />,
    path: "/reports/trainers",
  },
  {
    name: "Membership Summary",
    icon: <FaUsers size={26} />,
    path: "/reports/memberships",
  },
];

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-wrapper p-8"
      style={{ backgroundImage: `url(${reportsBg})` }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-light)" }}>
          View and analyze system reports
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {reportModules.map((item, index) => (
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

export default Reports;
