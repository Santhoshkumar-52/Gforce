import { useContext, useState, useMemo, useCallback } from "react";
import "../../styles/reports.css";
import axios from "axios";
import reportsBg from "../../assets/reports.png";
import CommonValueContext from "../../layouts/CommonvalueContext.jsx";
import ReusableTable from "../../components/ReusableTable.jsx";
import Clientdropdown from "../../components/Clientdropdown.jsx";
import DurationSelector from "../../components/DurationSelector.jsx";
import LoadButton from "../../components/buttons/LoadButton.jsx";
import Swal from "sweetalert2";
import { FiEye } from "react-icons/fi";

const SaleReport = () => {
  const { branchid, baseUrl, getGroupIds, groupid } =
    useContext(CommonValueContext);

  // State to hold selected branch and duration
  const [filters, setFilters] = useState({
    branchid: "",
    startdate: new Date().toISOString().split("T")[0],
    enddate: new Date().toISOString().split("T")[0],
  });
  const [records, setRecords] = useState([]);

  // Callback when branch changes
  const handleBranchChange = (branchid) => {
    setFilters((prev) => ({ ...prev, branchid }));
  };

  // Callback when duration changes
  const handleDurationChange = (startdate, enddate) => {
    setFilters((prev) => ({ ...prev, startdate, enddate }));
  };

  // Load button click
  const handleLoad = useCallback(async () => {
    if (!filters.branchid || !filters.startdate || !filters.enddate) {
      return Swal.fire({
        icon: "info",
        title: "Kindly Select branch",
      });
    }
    try {
      const response = await axios.get(
        `${baseUrl}/api/reports/salereport/getsalereport`,
        {
          params: {
            branchid: filters.branchid,
            fromdate: filters.startdate,
            todate: filters.enddate,
          },
        },
      );

      const data = response.data.data;
      setRecords(data);
    } catch (error) {
      console.error("Error loading report:", error);
    }
  }, [filters]);

  const columns = [
    {
      id: "view",
      header: "Bill",
      size: 50,
      Cell: ({ row }) => {
        const saleId = row.original.saleUniqueId;

        const handleOpen = () => {
          window.open(`/sales/invoice/${saleId}`, "_blank");
        };

        return (
          <FiEye
          className="text-green-600"
            onClick={handleOpen}
            style={{
              cursor: "pointer",
              fontSize: "18px",
            }}
            title="View Bill"
          />
        );
      },
    },
    {
      accessorKey: "saleDate",
      header: "Date",
      size: 90,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        if (!value) return "";
        return new Date(value).toLocaleDateString("en-IN");
      },
    },
    { accessorKey: "billno", header: "Bill No", size: 90 },
    { accessorKey: "saleType", header: "Sale Type", size: 110 },
    { accessorKey: "nettAmount", header: "Bill Amount", size: 110 },
    { accessorKey: "paidAmount", header: "Paid Amount", size: 110 },
    { accessorKey: "status", header: "Bill Status", size: 100 },
    { accessorKey: "paymentMode.cash", header: "Cash", size: 80 },
    { accessorKey: "paymentMode.card", header: "Card", size: 80 },
    { accessorKey: "paymentMode.upi", header: "UPI", size: 80 },
  ];

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

      <section className="my-6 flex gap-4 items-end flex-wrap">
        <Clientdropdown onChangeClient={handleBranchChange} />
        <DurationSelector onChangeDuration={handleDurationChange} />
        <LoadButton onClick={handleLoad} />
      </section>

      {/* Table */}
      <div className="glass-card p-4">
        <ReusableTable columns={columns} data={records} />
      </div>
    </div>
  );
};

export default SaleReport;
