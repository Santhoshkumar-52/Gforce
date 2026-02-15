import { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { MdEdit } from "react-icons/md";
import useStore from "../store/useStore.js";
import axios from "axios";

const MemberTable = ({ onEdit }) => {
  const [data, setData] = useState([]);
  const clientid = useStore((state) => state.branchid);
  const baseURL = useStore((state) => state.baseUrl);
  useEffect(() => {
    axios
      .post(`${baseURL}/api/member/getmembers`, { clientid })
      .then((response) => {
        console.log(response.data.records);
        const data = response.data.records;
        setData(data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  const columns = [
    {
      header: "Sno",
      accessorKey: "id",
      Cell: ({ row }) => row.index + 1, // Auto number,
      size: 2,
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
    { accessorKey: "plan_status", header: "Plan status", size: 2 },
    { accessorKey: "start_date", header: "Start Date", size: 2 },
    { accessorKey: "expiry_date", header: "Expiry Date", size: 2 },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "isactive",
      header: "Status",
      Cell: ({ row }) => (row.original.isactive ? "Active" : "Inactive"),
    },
    {
      accessorKey: "edit",
      header: "Edit",
      size: 2,
      Cell: ({ row }) => {
        const customerid = row.original.customerId;

        return (
          <MdEdit
            onClick={() => onEdit(customerid)}
            className="text-blue-600 hover:text-blue-800 text-xl cursor-pointer"
          />
        );
      },
    },
  ];

  return (
    <div className="w-100 md:w-180 xl:w-350 overflow-x-auto">
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnFilters
        enableSorting
        enablePagination
        enableColumnActions={false}
        muiTableContainerProps={{
          sx: {
            width: "100%",
            overflowX: "auto",
            height: "20", // allows scroll
          },
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
