import React, { useContext, useEffect, useState } from "react";
import CommonValueContext from "../layouts/CommonvalueContext";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import "../styles/inputs.css";

const sx = {
  width: 220,

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
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--input-label)",
};

const Clientdropdown = ({ onChangeClient }) => {
  const { branchids, setclientids, branchid } = useContext(CommonValueContext);

  const [selected, setSelected] = useState(null);

  // load branches
  useEffect(() => {
    setclientids();
  }, []);

  // set default branch
  useEffect(() => {
    if (!branchids?.length) return;

    const branch = branchids.find((b) => b._id === branchid) || branchids[0];

    setSelected(branch);

    // send initial value
    onChangeClient?.(branch?._id || "");
  }, [branchids, branchid]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <label style={labelStyle}>Select Branch</label>

      <Autocomplete
        options={branchids || []}
        value={selected}
        getOptionLabel={(o) => o.branchname || ""}
        isOptionEqualToValue={(o, v) => o._id === v._id}
        sx={sx}
        onChange={(_, value) => {
          setSelected(value);
          onChangeClient?.(value?._id || "");
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
