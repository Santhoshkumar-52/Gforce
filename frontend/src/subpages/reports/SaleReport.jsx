import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import "../../styles/reports.css";
import reportsBg from "../../assets/reports.png";
import CommonValueContext from "../../layouts/CommonvalueContext.jsx";
import ReusableTable from "../../components/ReusableTable.jsx";
import Clientdropdown from "../../components/Clientdropdown.jsx";
import DurationSelector from "../../components/DurationSelector.jsx";
import LoadButton from "../../components/LoadButton.jsx";

const SaleReport = () => {
  const {
    branchid: defaultBranchid,
    baseUrl,
    getGroupIds,
    groupid,
  } = useContext(CommonValueContext);

  // State to hold selected branch and duration
  const [filters, setFilters] = useState({
    branchid: "",
    startdate: new Date().toISOString().split("T")[0],
    enddate: new Date().toISOString().split("T")[0],
  });

  // Callback when branch changes
  const handleBranchChange = (branchid) => {
    setFilters((prev) => ({ ...prev, branchid }));
  };

  // Callback when duration changes
  const handleDurationChange = (startdate, enddate) => {
    setFilters((prev) => ({ ...prev, startdate, enddate }));
  };

  // Load button click
  const handleLoad = useCallback(() => {
    console.log("Filters to load:", filters);
    // Here you can call your API or fetch data using filters.branchid, filters.startdate, filters.enddate
  }, [filters]);

  return (
    <div
      className="bg-wrapper p-8"
      style={{ backgroundImage: `url(${reportsBg})` }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Revenue Analytics</h2>
        <p style={{ color: "var(--text-light)" }}>
          Monitor revenue trends, income breakdown, and financial performance
        </p>
      </div>

      {/* Filters Section */}
      <section className="my-6 flex gap-4 items-end">
        <Clientdropdown onChangeClient={handleBranchChange} />
        <DurationSelector onChangeDuration={handleDurationChange} />
        <LoadButton onClick={handleLoad} />
      </section>

      {/* Table */}
      <div className="glass-card p-4">
        <ReusableTable
          filters={filters} // optional: pass filters to table to fetch filtered data
        />
      </div>
    </div>
  );
};

export default SaleReport;
