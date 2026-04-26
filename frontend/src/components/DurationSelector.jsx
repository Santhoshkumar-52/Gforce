import React, { useMemo, useState, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";

// ─── Constants ────────────────────────────────────────────────────────────────

const DURATION_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "ytdy" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 14 Days", value: "last14" },
  { label: "This Month", value: "month" },
  { label: "Custom", value: "custom" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toISODate = (date) => date.toISOString().split("T")[0];

const resolveDateRange = (duration) => {
  const today = new Date();

  const presets = {
    today: () => ({ startdate: toISODate(today), enddate: toISODate(today) }),

    ytdy: () => {
      const d = new Date(today);
      d.setDate(d.getDate() - 1);
      return { startdate: toISODate(d), enddate: toISODate(d) };
    },

    last7: () => {
      const d = new Date(today);
      d.setDate(d.getDate() - 6);
      return { startdate: toISODate(d), enddate: toISODate(today) };
    },

    last14: () => {
      const d = new Date(today);
      d.setDate(d.getDate() - 13);
      return { startdate: toISODate(d), enddate: toISODate(today) };
    },

    month: () => {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startdate: toISODate(start), enddate: toISODate(today) };
    },
  };

  return (
    presets[duration]?.() ?? {
      startdate: toISODate(today),
      enddate: toISODate(today),
    }
  );
};

// ─── Shared MUI Input Styles ──────────────────────────────────────────────────

const inputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--input-bg)",
    borderRadius: "6px",
    fontSize: "14px",
    "& fieldset": { borderColor: "var(--input-border)" },
    "&:hover fieldset": { borderColor: "var(--input-border-hover)" },
    "&.Mui-focused fieldset": { borderColor: "var(--input-border-focus)" },
  },
  "& .MuiSvgIcon-root": { color: "var(--input-icon)" },
  "& .MuiInputBase-input": {
    color: "var(--input-text)",
    WebkitTextFillColor: "var(--input-text)", // overrides MUI disabled grey
  },
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--input-label)",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const FieldLabel = ({ children }) => (
  <label style={labelStyle}>{children}</label>
);

const DateField = ({ label, value, onChange, readOnly }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
    <FieldLabel>{label}</FieldLabel>
    <TextField
      type="date"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={readOnly}
      sx={{ width: 160, ...inputSx }}
    />
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const DurationSelector = ({ onChangeDuration }) => {
  const [selected, setSelected] = useState(DURATION_OPTIONS[0]);
  const [startdate, setStartdate] = useState(
    () => resolveDateRange("today").startdate,
  );
  const [enddate, setEnddate] = useState(
    () => resolveDateRange("today").enddate,
  );

  const isCustom = selected?.value === "custom";

  // Notify parent whenever dates change
  const notify = useCallback(
    (start, end) => {
      onChangeDuration?.(start, end);
    },
    [onChangeDuration],
  );

  const handleDurationChange = useCallback(
    (_, option) => {
      if (!option) return;
      setSelected(option);

      if (option.value !== "custom") {
        const { startdate: s, enddate: e } = resolveDateRange(option.value);
        setStartdate(s);
        setEnddate(e);
        notify(s, e);
      }
      // For custom, keep existing dates and let user edit
    },
    [notify],
  );

  const handleStartChange = useCallback(
    (val) => {
      setStartdate(val);
      notify(val, enddate);
    },
    [enddate, notify],
  );

  const handleEndChange = useCallback(
    (val) => {
      setEnddate(val);
      notify(startdate, val);
    },
    [startdate, notify],
  );

  return (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 2 }}
    >
      {/* Duration Dropdown */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <FieldLabel>Select Duration</FieldLabel>
        <Autocomplete
          options={DURATION_OPTIONS}
          value={selected}
          getOptionLabel={(option) => option.label}
          onChange={handleDurationChange}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          disableClearable
          sx={{ width: 220, ...inputSx }}
          renderInput={(params) => <TextField {...params} size="small" />}
        />
      </Box>

      {/* From Date */}
      <DateField
        style={{ marginLeft: "16px" }}
        label="From Date"
        value={startdate}
        onChange={handleStartChange}
        readOnly={!isCustom}
      />

      {/* To Date */}
      <DateField
        label="To Date"
        value={enddate}
        onChange={handleEndChange}
        readOnly={!isCustom}
      />
    </Box>
  );
};

export default DurationSelector;
