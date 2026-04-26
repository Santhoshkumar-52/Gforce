import React, { useContext, useEffect, useState } from "react";
import CommonValueContext from "../layouts/CommonvalueContext";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import "../styles/inputs.css";

const Clientdropdown = ({ onChangeClient }) => {
  const { branchids, setclientids, branchid } = useContext(CommonValueContext);

  const [selectedBranch, setSelectedBranch] = useState(null);

  // Load branches on mount
  useEffect(() => {
    setclientids();
  }, []);

  // Update selectedBranch when branchids or branchid changes
  useEffect(() => {
    if (!branchids?.length) return;

    const found = branchids.find((b) => b._id === branchid) || branchids[0];
    setSelectedBranch(found);
  }, [branchids, branchid]);

  const handleChange = (event, newValue) => {
    setSelectedBranch(newValue);
    if (onChangeClient) {
      onChangeClient(newValue ? newValue._id : "");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <label
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--input-label)",
        }}
      >
        Select Branch
      </label>

      <Autocomplete
        options={branchids || []}
        value={selectedBranch}
        getOptionLabel={(option) => option.branchname || ""}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        sx={{
          width: 220,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "var(--input-bg)",
            borderRadius: "6px",
            fontSize: "14px",
            "& fieldset": { borderColor: "var(--input-border)" },
            "&:hover fieldset": { borderColor: "var(--input-border-hover)" },
            "&.Mui-focused fieldset": {
              borderColor: "var(--input-border-focus)",
            },
          },
          "& .MuiSvgIcon-root": { color: "var(--input-icon)" },
        }}
        PaperComponent={(props) => (
          <Box
            {...props}
            sx={{
              backgroundColor: "var(--input-bg)",
              color: "var(--input-text)",
              fontSize: "14px",
            }}
          />
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder="Select Branch" size="small" />
        )}
      />
    </Box>
  );
};

export default Clientdropdown;
