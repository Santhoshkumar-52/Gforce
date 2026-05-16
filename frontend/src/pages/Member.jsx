import React, { Fragment, useState } from "react";
import { Tab, Dialog, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import "../styles/member.css";
import { Box, TextField, Autocomplete } from "@mui/material";
import api from "../services/apiService.js";
import useStore from "../store/useStore.js";
import MemberTable from "../pageUIBlocks/MemberTable.jsx";
import memberBg from "../assets/members.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── Shared styles (your exact tokens) ────────────────────────────────────────
const sx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--input-bg)",
    borderRadius: "6px",
    fontSize: "14px",
    "& fieldset": { borderColor: "var(--input-border)" },
    "&:hover fieldset": { borderColor: "var(--input-border-hover)" },
    "&.Mui-focused fieldset": { borderColor: "var(--input-border-focus)" },
  },
  "& .MuiSvgIcon-root": { color: "var(--input-icon)" },
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

// ─── Static option lists ───────────────────────────────────────────────────────
const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const maritalOptions = [
  { label: "Single", value: "Single" },
  { label: "Married", value: "Married" },
];

const statusOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Member = () => {
  const clientid = useStore((state) => state.branchid);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const defaultform = {
    memberid: "",
    firstname: "",
    lastname: "",
    gender: "Male",
    dob: "",
    marital_status: "Single",
    mobile: "",
    alternate_mobile: "",
    email: "",
    address_line1: "",
    address_line2: "",
    area: "",
    city: "",
    pincode: "",
    isactive: true,
    clientid,
  };

  const [form, setForm] = useState(defaultform);

  // ── helpers ────────────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const applyChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toast = (icon, text, title = "") =>
    Swal.fire({
      icon,
      title,
      text,
      timer: 1500,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });

  const validate = () => {
    const required = {
      firstname: "First Name",
      mobile: "Phone",
      alternate_mobile: "Alternate Phone",
      dob: "Date of Birth",
      area: "Area",
      address_line1: "Address",
    };
    for (let [key, label] of Object.entries(required)) {
      if (!String(form[key] ?? "").trim()) {
        toast("warning", `${label} is missing!`);
        return false;
      }
    }
    return true;
  };

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    try {
      const res = await api.post("/member/addmember", form);
      toast(res.data.status, res.data.message, res.data.title);
      if (res.data.status === "success") handleClear();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  const handleClear = () => setForm(defaultform);

  const handleEdit = async (id) => {
    try {
      const response = await api.get("/member/getdetails", {
        params: { memberid: id },
      });
      const member = response.data.result[0];
      setForm({
        memberid: member.customerId,
        firstname: member.firstname || "",
        lastname: member.lastname || "",
        gender: member.gender || "Male",
        dob: member.dob?.slice(0, 10) || "",
        marital_status: member.marital_status || "Single",
        mobile: member.mobile || "",
        alternate_mobile: member.alternate_mobile || "",
        email: member.email || "",
        address_line1: member.address_line1 || "",
        address_line2: member.address_line2 || "",
        area: member.area || "",
        city: member.city || "",
        pincode: member.pincode || "",
        isactive: member.isactive,
        clientid,
      });
      setIsEditOpen(true);
    } catch (err) {
      Swal.fire({ icon: "error", text: err.message });
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      const response = await api.patch("/member/updatemember", form);
      if (response.data) {
        const { status, title, text } = response.data;
        toast(status, text, title);
        setIsEditOpen(false);
      }
    } catch (err) {
      toast("error", err.response?.data?.message || err.message, "Error");
    }
  };

  const handleBack = () => window.history.back();

  const closeEditModal = () => {
    setIsEditOpen(false);
    setForm(defaultform);
  };

  // ─── Add Member form (inline JSX — NOT a nested component, avoids focus loss) ──
  const addFormJSX = (
    <div
      id="addfields"
      className="p-6 rounded-xl shadow-md backdrop-blur-md bg-white/10 border border-white/10"
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Member Id</label>
          <TextField
            size="small"
            placeholder="Auto-generated if empty"
            name="memberid"
            value={form.memberid}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>First Name *</label>
          <TextField
            size="small"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Last Name</label>
          <TextField
            size="small"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Gender *</label>
          <Autocomplete
            options={genderOptions}
            value={genderOptions.find((o) => o.value === form.gender) || null}
            getOptionLabel={(o) => o.label}
            isOptionEqualToValue={(o, v) => o.value === v.value}
            onChange={(_, v) => applyChange("gender", v ? v.value : "Male")}
            sx={{ ...sx }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select gender…"
              />
            )}
          />
        </Box>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Date of Birth *</label>
          <TextField
            size="small"
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Marital Status</label>
          <Autocomplete
            options={maritalOptions}
            value={
              maritalOptions.find((o) => o.value === form.marital_status) ||
              null
            }
            getOptionLabel={(o) => o.label}
            isOptionEqualToValue={(o, v) => o.value === v.value}
            onChange={(_, v) =>
              applyChange("marital_status", v ? v.value : "Single")
            }
            sx={{ ...sx }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select status…"
              />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Phone *</label>
          <TextField
            size="small"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            sx={sx}
          />
        </Box>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Alternate Phone *</label>
          <TextField
            size="small"
            name="alternate_mobile"
            value={form.alternate_mobile}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Email</label>
          <TextField
            size="small"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Area *</label>
          <TextField
            size="small"
            name="area"
            value={form.area}
            onChange={handleChange}
            sx={sx}
          />
        </Box>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gridColumn: "span 2",
          }}
        >
          <label style={labelStyle}>Address *</label>
          <TextField
            size="small"
            name="address_line1"
            value={form.address_line1}
            onChange={handleChange}
            sx={{ width: "100%", ...sx }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Address 2</label>
          <TextField
            size="small"
            name="address_line2"
            value={form.address_line2}
            onChange={handleChange}
            sx={sx}
          />
        </Box>
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>City</label>
          <TextField
            size="small"
            name="city"
            value={form.city}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Pincode</label>
          <TextField
            size="small"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            sx={sx}
          />
        </Box>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-lg text-white"
          style={{ background: "var(--crm-primary)" }}
        >
          Save
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 rounded-lg border text-[var(--crm-primary)]"
          style={{ borderColor: "var(--crm-primary)" }}
        >
          Clear
        </button>
        <button
          onClick={handleBack}
          className="px-6 py-2 rounded-lg border border-gray-400"
        >
          Back
        </button>
      </div>
    </div>
  );

  // ─── Edit Modal form (same approach — inline JSX) ──────────────────────────
  const editFormJSX = (
    <>
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Member Id</label>
          <TextField
            size="small"
            name="memberid"
            value={form.memberid}
            disabled
            sx={{
              ...sx,
              "& .MuiOutlinedInput-root": {
                ...sx["& .MuiOutlinedInput-root"],
                backgroundColor: "var(--input-disabled-bg, #f3f4f6)",
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>First Name *</label>
          <TextField
            size="small"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Last Name</label>
          <TextField
            size="small"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Gender *</label>
          <Autocomplete
            options={genderOptions}
            value={genderOptions.find((o) => o.value === form.gender) || null}
            getOptionLabel={(o) => o.label}
            isOptionEqualToValue={(o, v) => o.value === v.value}
            onChange={(_, v) => applyChange("gender", v ? v.value : "Male")}
            sx={{ ...sx }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select gender…"
              />
            )}
          />
        </Box>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Date of Birth *</label>
          <TextField
            size="small"
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Marital Status</label>
          <Autocomplete
            options={maritalOptions}
            value={
              maritalOptions.find((o) => o.value === form.marital_status) ||
              null
            }
            getOptionLabel={(o) => o.label}
            isOptionEqualToValue={(o, v) => o.value === v.value}
            onChange={(_, v) =>
              applyChange("marital_status", v ? v.value : "Single")
            }
            sx={{ ...sx }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select status…"
              />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Phone *</label>
          <TextField
            size="small"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            sx={sx}
          />
        </Box>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Alternate Phone</label>
          <TextField
            size="small"
            name="alternate_mobile"
            value={form.alternate_mobile}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Email</label>
          <TextField
            size="small"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Area *</label>
          <TextField
            size="small"
            name="area"
            value={form.area}
            onChange={handleChange}
            sx={sx}
          />
        </Box>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gridColumn: "span 2",
          }}
        >
          <label style={labelStyle}>Address *</label>
          <TextField
            size="small"
            name="address_line1"
            value={form.address_line1}
            onChange={handleChange}
            sx={{ width: "100%", ...sx }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Address 2</label>
          <TextField
            size="small"
            name="address_line2"
            value={form.address_line2}
            onChange={handleChange}
            sx={sx}
          />
        </Box>
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>City</label>
          <TextField
            size="small"
            name="city"
            value={form.city}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Pincode</label>
          <TextField
            size="small"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            sx={sx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Status</label>
          <Autocomplete
            options={statusOptions}
            value={statusOptions.find((o) => o.value === form.isactive) || null}
            getOptionLabel={(o) => o.label}
            isOptionEqualToValue={(o, v) => o.value === v.value}
            onChange={(_, v) => applyChange("isactive", v ? v.value : true)}
            sx={{ ...sx }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select status…"
              />
            )}
          />
        </Box>
      </div>
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="p-4 md:p-6 pb-20 bg-wrapper"
      style={{ backgroundImage: `url(${memberBg})` }}
    >
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-white">Members</h1>

        <p className="text-sm mt-1 text-gray-300">
          View and manage member details such as contact information and address
        </p>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex">
          {["Customer List", "Add Member"].map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                classNames(
                  "px-4 py-2 text-sm font-medium rounded-full outline-none transition-all duration-200",
                  "border border-transparent",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/40 mb-2",
                  selected
                    ? "bg-green-500 text-white shadow-md border-green-300 scale-[1.02]"
                    : "bg-green-900/40 text-green-100 hover:bg-green-800/60 hover:text-white cursor-pointer",
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* TABLE */}
          <Tab.Panel>
            <MemberTable key={String(isEditOpen)} onEdit={handleEdit} />
          </Tab.Panel>

          {/* ADD MEMBER */}
          <Tab.Panel>{addFormJSX}</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* EDIT MODAL */}
      <Transition appear show={isEditOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeEditModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="min-w-1xl rounded-xl p-6 shadow-xl"
                  style={{ background: "var(--crm-card)" }}
                >
                  <Dialog.Title className="text-lg font-semibold mb-4">
                    Edit Member
                  </Dialog.Title>

                  {editFormJSX}

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={closeEditModal}
                      className="px-6 py-2 rounded-lg border border-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="px-6 py-2 rounded-lg text-white"
                      style={{ background: "var(--crm-primary)" }}
                    >
                      Update
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Member;
