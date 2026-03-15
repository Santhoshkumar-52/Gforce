import React, { useContext, useEffect } from "react";
import CommonValueContext from "../layouts/CommonvalueContext";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import "../styles/inputs.css";

const Clientdropdown = ({ onChangeClient }) => {
  const { branchids, setclientids } = useContext(CommonValueContext);

  useEffect(() => {
    setclientids();
  }, []);

  const handleChange = (event, selectedOption) => {
    if (onChangeClient) {
      onChangeClient(selectedOption ? selectedOption._id : "");
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
        options={branchids}
        getOptionLabel={(option) => option.branchname || ""}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        sx={{
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
        }}
        paperprops={{
          sx: {
            backgroundColor: "var(--input-bg)",
            color: "var(--input-text)",
            fontSize: "14px",
          },
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder="Select Branch" size="small" />
        )}
      />
    </Box>
  );
};

export default Clientdropdown;
