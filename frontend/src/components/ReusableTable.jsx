import React from "react";
import { MaterialReactTable } from "material-react-table";

const ReusableTable = ({
  columns = [],
  data = [],
  enableRowActions = false,
  renderRowActions,
  loading = false,
  maxHeight = "350px",
}) => {
  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      state={{ isLoading: loading }}
      enableRowActions={enableRowActions}
      renderRowActions={renderRowActions}
      enableColumnFilters
      enablePagination
      enableSorting
      enableTopToolbar
      enableBottomToolbar
      enableStickyHeader
      enableFullScreenToggle={false}
      initialState={{
        density: "compact", // "comfortable" | "spacious"
      }}
      // ✅ Scroll
      muiTableContainerProps={{
        sx: {
          maxHeight: maxHeight,
          overflow: "auto",
          borderRadius: "12px",
        },
      }}
      // ✅ Table Paper (Main container)
      muiTablePaperProps={{
        elevation: 0,
        sx: {
          background: "transparent", // let glass-card handle bg
        },
      }}
      // ✅ Header Styling
      muiTableHeadCellProps={{
        sx: {
          fontWeight: "bold",
          fontSize: "14px",
          color: "#111",
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(6px)",
        },
      }}
      // ✅ Body Cell Styling
      muiTableBodyCellProps={{
        sx: {
          fontSize: "14px",
          color: "#222",
        },
      }}
      // ✅ Row Styling
      muiTableBodyRowProps={{
        sx: {
          backgroundColor: "rgba(255,255,255,0.85)",
          "&:hover": {
            backgroundColor: "rgba(240,240,240,0.95)",
          },
        },
      }}
      // ✅ Toolbar Styling (top search/filter bar)
      muiTopToolbarProps={{
        sx: {
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          borderRadius: "12px 12px 0 0",
        },
      }}
      // ✅ Bottom Toolbar
      muiBottomToolbarProps={{
        sx: {
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          borderRadius: "0 0 12px 12px",
        },
      }}
    />
  );
};

export default ReusableTable;
