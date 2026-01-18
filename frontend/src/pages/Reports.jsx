import { Link } from "react-router-dom";
import { FaChartBar } from "react-icons/fa";
import "../styles/reports.css"; // colors only

const Reports = () => {
  return (
    <div className="p-6">
      <h1
        className="text-3xl font-medium"
        style={{ color: "var(--text-color)" }}
      >
        Reports
      </h1>

      <hr className="my-4" style={{ borderColor: "var(--border-color)" }} />

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sale Report Card */}
        <Link
          to="/reports/salereport"
          className="
            flex flex-col items-center justify-center
            p-8 rounded-xl shadow-md
            hover:shadow-lg hover:-translate-y-1
            transition-transform duration-300
          "
          style={{ background: "var(--card-bg)" }}
        >
          <FaChartBar
            className="text-5xl"
            style={{ color: "var(--icon-color)" }}
          />

          <p
            className="text-lg font-semibold mt-3"
            style={{ color: "var(--text-color)" }}
          >
            Sale Report
          </p>
        </Link>
        <Link
          to="/reports/salereport"
          className="
            flex flex-col items-center justify-center
            p-8 rounded-xl shadow-md
            hover:shadow-lg hover:-translate-y-1
            transition-transform duration-300
          "
          style={{ background: "var(--card-bg)" }}
        >
          <FaChartBar
            className="text-5xl"
            style={{ color: "var(--icon-color)" }}
          />

          <p
            className="text-lg font-semibold mt-3"
            style={{ color: "var(--text-color)" }}
          >
            Sale Report
          </p>
        </Link>
        <Link
          to="/reports/salereport"
          className="
            flex flex-col items-center justify-center
            p-8 rounded-xl shadow-md
            hover:shadow-lg hover:-translate-y-1
            transition-transform duration-300
          "
          style={{ background: "var(--card-bg)" }}
        >
          <FaChartBar
            className="text-5xl"
            style={{ color: "var(--icon-color)" }}
          />

          <p
            className="text-lg font-semibold mt-3"
            style={{ color: "var(--text-color)" }}
          >
            Sale Report
          </p>
        </Link>
        <Link
          to="/reports/salereport"
          className="
            flex flex-col items-center justify-center
            p-8 rounded-xl shadow-md
            hover:shadow-lg hover:-translate-y-1
            transition-transform duration-300
          "
          style={{ background: "var(--card-bg)" }}
        >
          <FaChartBar
            className="text-5xl"
            style={{ color: "var(--icon-color)" }}
          />

          <p
            className="text-lg font-semibold mt-3"
            style={{ color: "var(--text-color)" }}
          >
            Sale Report
          </p>
        </Link>
        <Link
          to="/reports/salereport"
          className="
            flex flex-col items-center justify-center
            p-8 rounded-xl shadow-md
            hover:shadow-lg hover:-translate-y-1
            transition-transform duration-300
          "
          style={{ background: "var(--card-bg)" }}
        >
          <FaChartBar
            className="text-5xl"
            style={{ color: "var(--icon-color)" }}
          />

          <p
            className="text-lg font-semibold mt-3"
            style={{ color: "var(--text-color)" }}
          >
            Sale Report
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Reports;
