import React, { useContext, useState } from "react";
import "../styles/dashboard.css";
import CommonValueContext from "../layouts/CommonvalueContext";
//icons
import { MdOutlinePointOfSale } from "react-icons/md";
const Dashboard = () => {
  const [totalSales, saveSales] = useState(0.0);
  const { priceformat } = useContext(CommonValueContext);
  const dashboardcards = [
    { title: "Total Sales", value: totalSales, icon: <MdOutlinePointOfSale /> },
    { title: "Total Sales", value: totalSales, icon: <MdOutlinePointOfSale /> },
    { title: "Total Sales", value: totalSales, icon: <MdOutlinePointOfSale /> },
    { title: "Total Sales", value: totalSales, icon: <MdOutlinePointOfSale /> },
    { title: "Total Sales", value: totalSales, icon: <MdOutlinePointOfSale /> },
  ];
  return (
    <div className="p-6" style={{ backgroundColor: "var(--bg-page)" }}>
      <h1
        className="text-3xl font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        Dashboard
      </h1>

      <hr className="my-4" style={{ borderColor: "var(--border-default)" }} />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards Section */}
        <div
          className="h-115 overflow-y-auto order-1 md:order-2 md:col-span-1 space-y-4 p-4 shadow"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Quick Info
          </h2>
          {dashboardcards.map((record, index) => (
            <div
              key={index}
              id={index + 1}
              className="rounded-lg shadow p-4"
              style={{
                backgroundColor: `var(--card-bg${(index % 5) + 1})`,
                color: "var(--card-text)",
              }}
            >
              <p>{record.title}</p>

              <p
                className="text-2xl font-semibold"
                style={{ color: "var(--card-text)" }}
              >
                {priceformat}
                {record.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div
          className="order-2 md:order-1 md:col-span-2 rounded-lg shadow p-4"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Charts
          </h2>

          <div
            className="h-64 flex items-center justify-center rounded"
            style={{ border: "1px dashed var(--border-default)" }}
          >
            Chart Area
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
