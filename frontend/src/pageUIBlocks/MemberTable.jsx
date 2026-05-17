import { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { MdEdit } from "react-icons/md";
import useStore from "../store/useStore.js";
import api from "../services/apiService.js";

const MemberTable = ({ onEdit }) => {
  const [data, setData] = useState([]);
  const clientid = useStore((state) => state.branchid);

  useEffect(() => {
    api
      .post("/member/getmembers", { clientid })
      .then((response) => {
        const records = response.data.records;
        setData(records);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  const columns = [
    {
      accessorKey: "edit",
      header: "Edit",
      size: 2,
      Cell: ({ row }) => {
        const customerid = row.original.customerId;
        return (
          <button
            onClick={() => onEdit(customerid)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            <MdEdit />
          </button>
        );
      },
    },
    {
      accessorFn: (row) => `${row.firstname} ${row.lastname}` || "-",
      header: "Name",
    },
    { accessorKey: "customerId", header: "MemberId" },
    { accessorKey: "gender", header: "Gender", size: 2 },
    { accessorKey: "mobile", header: "Mobile", size: 4 },
    { accessorKey: "alternate_mobile", header: "Alternate Mobile", size: 4 },
    { accessorKey: "area", header: "Area", size: 3 },
    { accessorKey: "plan_name", header: "Plan" },
    { accessorKey: "plan_status", header: "Plan Status", size: 2 },
    { accessorKey: "start_date", header: "Start Date", size: 2 },
    { accessorKey: "expiry_date", header: "Expiry Date", size: 2 },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "isactive",
      header: "Status",
      Cell: ({ row }) => (row.original.isactive ? "Active" : "Inactive"),
    },
  ];

  return (
    <div className="w-100 md:w-180 xl:w-350 overflow-auto p-2 rounded-xl shadow-md backdrop-blur-md bg-white/10 border border-white/10">
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnFilters
        enableSorting
        enablePagination
        enableColumnActions={false}
        muiTableContainerProps={{
          sx: { width: "100%", overflow: "auto",maxBlockSize: "54vh" },
        }}
        muiTableHeadProps={{
          sx: { backgroundColor: "var(--table-header-bg)" },
        }}
        muiTableBodyProps={{
          sx: { backgroundColor: "var(--table-body-bg)" },
        }}
      />
    </div>
  );
};

export default MemberTable;
