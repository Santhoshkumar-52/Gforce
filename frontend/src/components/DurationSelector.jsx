import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";

const OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "ytdy" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 14 Days", value: "last14" },
  { label: "This Month", value: "month" },
  { label: "Custom", value: "custom" },
];

const sx = {
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
  "& .MuiInputBase-input": {
    color: "var(--input-text)",
    WebkitTextFillColor: "var(--input-text)",
  },
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--input-label)",
};

const format = (d) => d.toISOString().split("T")[0];

const getDates = (type) => {
  const today = new Date();
  const start = new Date(today);

  switch (type) {
    case "ytdy":
      start.setDate(today.getDate() - 1);
      return { startdate: format(start), enddate: format(start) };

    case "last7":
      start.setDate(today.getDate() - 6);
      break;

    case "last14":
      start.setDate(today.getDate() - 13);
      break;

    case "month":
      start.setDate(1);
      break;

    default:
      break;
  }

  return {
    startdate: format(start),
    enddate: format(today),
  };
};

const DurationSelector = ({ onChangeDuration }) => {
  const [selected, setSelected] = useState(OPTIONS[0]);

  const defaultDates = getDates("today");

  const [startdate, setStartdate] = useState(defaultDates.startdate);
  const [enddate, setEnddate] = useState(defaultDates.enddate);

  const isCustom = selected.value === "custom";

  // send initial value
  useEffect(() => {
    onChangeDuration?.(startdate, enddate);
  }, []);

  const updateParent = (s, e) => {
    onChangeDuration?.(s, e);
  };

  const handleDuration = (_, option) => {
    setSelected(option);

    if (option.value !== "custom") {
      const { startdate, enddate } = getDates(option.value);

      setStartdate(startdate);
      setEnddate(enddate);

      updateParent(startdate, enddate);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        gap: 2,
      }}
    >
      {/* Duration */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <label style={labelStyle}>Select Duration</label>

        <Autocomplete
          options={OPTIONS}
          value={selected}
          disableClearable
          getOptionLabel={(o) => o.label}
          isOptionEqualToValue={(o, v) => o.value === v.value}
          onChange={handleDuration}
          sx={{ width: 220, ...sx }}
          renderInput={(params) => <TextField {...params} size="small" />}
        />
      </Box>

      {/* From */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <label style={labelStyle}>From Date</label>

        <TextField
          type="date"
          size="small"
          value={startdate}
          disabled={!isCustom}
          onChange={(e) => {
            setStartdate(e.target.value);
            updateParent(e.target.value, enddate);
          }}
          sx={{ width: 160, ...sx }}
        />
      </Box>

      {/* To */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <label style={labelStyle}>To Date</label>

        <TextField
          type="date"
          size="small"
          value={enddate}
          disabled={!isCustom}
          onChange={(e) => {
            setEnddate(e.target.value);
            updateParent(startdate, e.target.value);
          }}
          sx={{ width: 160, ...sx }}
        />
      </Box>
    </Box>
  );
};

export default DurationSelector;
