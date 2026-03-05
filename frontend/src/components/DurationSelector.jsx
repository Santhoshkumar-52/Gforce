import React, { useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import "../styles/inputs.css";

const DurationSelector = ({ onChangeDuration }) => {
  const formatDate = (date) => date.toISOString().split("T")[0];

  const handledate = (duration) => {
    const today = new Date();
    let startdate = "";
    let enddate = "";

    switch (duration) {
      case "today":
        startdate = formatDate(today);
        enddate = formatDate(today);
        break;

      case "ytdy": {
        const ytdy = new Date(today);
        ytdy.setDate(ytdy.getDate() - 1);
        startdate = formatDate(ytdy);
        enddate = formatDate(ytdy);
        break;
      }

      case "last7": {
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        startdate = formatDate(start);
        enddate = formatDate(today);
        break;
      }

      case "last14": {
        const start = new Date(today);
        start.setDate(start.getDate() - 13);
        startdate = formatDate(start);
        enddate = formatDate(today);
        break;
      }

      case "month": {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        startdate = formatDate(start);
        enddate = formatDate(today);
        break;
      }

      default:
        startdate = formatDate(today);
        enddate = formatDate(today);
    }

    return { startdate, enddate };
  };

  const options = useMemo(
    () => [
      { label: "Today", value: "today" },
      { label: "Yesterday", value: "ytdy" },
      { label: "Last 7 Days", value: "last7" },
      { label: "Last 14 Days", value: "last14" },
      { label: "This Month", value: "month" },
    ],
    [],
  );

  const handleChange = (event, selectedOption) => {
    if (selectedOption) {
      const { startdate, enddate } = handledate(selectedOption.value);
      onChangeDuration(startdate, enddate);
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
        Select Duration
      </label>

      <Autocomplete
        options={options}
        defaultValue={options[0]}
        getOptionLabel={(option) => option.label}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.value === value.value}
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
        renderInput={(params) => <TextField {...params} size="small" />}
      />
    </Box>
  );
};

export default DurationSelector;
