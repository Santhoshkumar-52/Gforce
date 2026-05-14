import { useCallback, useContext, useEffect, useState } from "react";

import { Box, TextField, Autocomplete } from "@mui/material";

import "../../styles/admin.css";
import adminBg from "../../assets/admin.png";

import CommonValueContext from "../../layouts/CommonvalueContext";
import Swal from "sweetalert2";
import api from "../../services/apiService.js";

const sx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--input-bg)",
    borderRadius: "6px",
    fontSize: "14px",

    "& fieldset": {
      borderColor: "var(--input-border)",
    },

    "&:hover fieldset": {
      borderColor: "var(--input-border-hover)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "var(--input-border-focus)",
    },
  },

  "& .MuiSvgIcon-root": {
    color: "var(--input-icon)",
  },
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--input-label)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "5px",
  display: "block",
};

const statusOptions = [
  {
    label: "Active",
    value: true,
  },
  {
    label: "Inactive",
    value: false,
  },
];

const ownershipOptions = [
  {
    label: "Owned",
    value: "Owned",
  },
  {
    label: "Rented",
    value: "Rented",
  },
  {
    label: "Leased",
    value: "Leased",
  },
];

const BranchSettings = () => {
  const { branchid } = useContext(CommonValueContext);

  const [form, setForm] = useState({
    _id: "",
    branchname: "",
    brancuniqueid: "",
    address: "",
    mobile: "",
    GSTNo: "",
    OwnershipType: "",
    activeStatus: true,
    location: "",
    branchlogo: "",
  });

  /* =========================================================
      FETCH BRANCH SETTINGS
  ========================================================= */
  const getBranchSettings = useCallback(async () => {
    try {
      Swal.fire({
        text: "Fetching Branch Settings...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const { data } = await api.get("/branchsettings", {
        params: {
          branchid,
        },
      });

      setForm(data.branchDetails);

      Swal.close();
    } catch (error) {
      Swal.close();

      Swal.fire({
        icon: "error",
        text: error.response?.data?.text || "Something went wrong",
      });
    }
  }, [branchid]);

  useEffect(() => {
    getBranchSettings();
  }, [getBranchSettings]);

  /* =========================================================
      HANDLE CHANGE
  ========================================================= */
  const handleChange = useCallback((name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /* =========================================================
      SAVE UPDATE
  ========================================================= */
  const updateBranch = useCallback(() => {
    if (!form.branchname || !form.mobile || !form.OwnershipType) {
      return Swal.fire({
        icon: "warning",
        text: "Please fill all required fields",
      });
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update branch settings?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.post("/branchsettings/update", form);

          Swal.fire({
            icon: response.data.status,
            text: response.data.text,
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false,
          });

          await getBranchSettings();
        } catch (error) {
          Swal.fire({
            icon: "error",
            text: error.response?.data?.text || "Something went wrong",
          });
        }
      }
    });
  }, [form, getBranchSettings]);

  return (
    <div
      className="bg-wrapper p-8"
      style={{
        backgroundImage: `url(${adminBg})`,
      }}
    >
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Branch Settings</h2>

        <p style={{ color: "var(--text-light)" }}>
          Manage your branch information
        </p>
      </div>

      {/* CARD */}
      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-5">
          {/* BRANCH NAME */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Branch Name *</label>

            <TextField
              size="small"
              value={form.branchname}
              onChange={(e) => handleChange("branchname", e.target.value)}
              placeholder="Enter Branch Name"
              sx={sx}
            />
          </Box>

          {/* UNIQUE ID */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Branch Unique ID</label>

            <TextField
              size="small"
              type="number"
              value={form.brancuniqueid}
              onChange={(e) => handleChange("brancuniqueid", e.target.value)}
              placeholder="Branch Unique ID"
              sx={sx}
            />
          </Box>

          {/* MOBILE */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Mobile Number *</label>

            <TextField
              size="small"
              type="tel"
              value={form.mobile}
              inputProps={{
                maxLength: 10,
              }}
              onChange={(e) => handleChange("mobile", e.target.value)}
              placeholder="Enter Mobile Number"
              sx={sx}
            />
          </Box>

          {/* GST */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>GST Number</label>

            <TextField
              size="small"
              value={form.GSTNo}
              onChange={(e) => handleChange("GSTNo", e.target.value)}
              placeholder="Enter GST Number"
              sx={sx}
            />
          </Box>

          {/* LOCATION */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Location</label>

            <TextField
              size="small"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Enter Location"
              sx={sx}
            />
          </Box>

          {/* OWNERSHIP */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Ownership Type *</label>

            <Autocomplete
              options={ownershipOptions}
              value={
                ownershipOptions.find((o) => o.value === form.OwnershipType) ||
                null
              }
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(o, v) => o.value === v.value}
              onChange={(_, v) =>
                handleChange("OwnershipType", v ? v.value : "")
              }
              sx={sx}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select Ownership"
                />
              )}
            />
          </Box>

          {/* ACTIVE STATUS */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Active Status</label>

            <Autocomplete
              options={statusOptions}
              value={
                statusOptions.find((o) => o.value === form.activeStatus) || null
              }
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(o, v) => o.value === v.value}
              onChange={(_, v) =>
                handleChange("activeStatus", v ? v.value : true)
              }
              sx={sx}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select Status"
                />
              )}
            />
          </Box>

          {/* LOGO */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Branch Logo Path</label>

            <TextField
              size="small"
              value={form.branchlogo}
              onChange={(e) => handleChange("branchlogo", e.target.value)}
              placeholder="Enter Logo Path"
              sx={sx}
            />
          </Box>

          {/* ADDRESS */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gridColumn: "span 3",
            }}
          >
            <label style={labelStyle}>Address</label>

            <TextField
              multiline
              rows={4}
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter Branch Address"
              sx={sx}
            />
          </Box>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={updateBranch}
          className="w-full mt-8 py-3 rounded-xl primary-btn"
        >
          Update Branch Settings
        </button>
      </div>
    </div>
  );
};

export default BranchSettings;
