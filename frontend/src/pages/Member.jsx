import React, { Fragment, useState } from "react";
import { Tab, Dialog, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import "../styles/member.css";
import axios from "axios";
import useStore from "../store/useStore.js";
import MemberTable from "../pageUIBlocks/MemberTable.jsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Member = () => {
  const baseUrl = useStore((state) => state.baseUrl);
  const clientid = useStore((state) => state.branchid);
  const [selectedTab, setSelectedTab] = useState(0); // for tabgroup
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
    // membership_status: "Active",
    clientid,
  };
  const [form, setForm] = useState(defaultform);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      if (!form[key]?.trim()) {
        Swal.fire({
          icon: "warning",
          text: `${label} is missing!`,
          timer: 1000,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    console.log(form);

    try {
      const res = await axios.post(`${baseUrl}/api/member/addmember`, form);

      Swal.fire({
        icon: res.data.status,
        title: res.data.title,
        text: res.data.message,
        timer: 1500,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
      if (res.data.status == "success") {
        handleClear();
      }
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
      const response = await axios.get(`${baseUrl}/api/member/getdetails`, {
        params: {
          memberid: id,
        },
      });

      const member = response.data.result[0];
      setForm({
        memberid: member.customerId, // ✅ mapping
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
      Swal.fire({
        icon: "error",
        text: err.message,
      });
    }
  };
  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      const response = await axios.patch(
        `${baseUrl}/api/member/updatemember`,
        form,
      );
      if (response.data) {
        const { status, title, text } = response.data;
        Swal.fire({
          position: "top-end",
          toast: true,
          timer: 2000,
          icon: status,
          text: text,
          title: title,
        });
        setIsEditOpen(false);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorText,
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
    }
  };

  const handleBack = () => window.history.back();
  const closeEditModal = () => {
    setIsEditOpen(false);
    setForm(defaultform);
  };

  return (
    <div className="p-6 overflow-hidden">
      <h1 className="text-3xl font-medium text-gray-800">Members</h1>
      <hr className="mb-5" />
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        {/* Tabs */}
        <Tab.List className="flex gap-4">
          {["Customer List", "Add Member"].map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                classNames(
                  "px-4 py-2 text-sm font-medium outline-none",
                  selected
                    ? "border-b-2 border-[var(--crm-primary)] text-[var(--crm-primary)]"
                    : "text-gray-600 cursor-pointer",
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
            <MemberTable key={isEditOpen == false} onEdit={handleEdit} />
          </Tab.Panel>

          {/* ADD MEMBER */}
          <Tab.Panel>
            <div
              id="addfields"
              className="p-6 rounded-xl shadow-md"
              style={{ background: "var(--crm-card)" }}
            >
              {/* form grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm">Member Id</label>
                  <input
                    placeholder="Member id auto-generate if not given (eg:1234)"
                    type="text"
                    name="memberid"
                    value={form.memberid}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm">First Name *</label>
                  <input
                    type="text"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm">Gender *</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col">
                  <label className="text-sm">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm">Marital Status</label>
                  <select
                    name="marital_status"
                    value={form.marital_status}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  >
                    <option>Single</option>
                    <option>Married</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm">Phone *</label>
                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col">
                  <label className="text-sm">Alternate Phone *</label>
                  <input
                    type="text"
                    name="alternate_mobile"
                    value={form.alternate_mobile}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm">Area *</label>
                  <input
                    type="text"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm">Address *</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={form.address_line1}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm">Address 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={form.address_line2}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col">
                  <label className="text-sm">City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="border rounded-lg p-2 bg-transparent"
                  />
                </div>
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
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <Transition appear show={isEditOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 border-2"
          onClose={closeEditModal}
        >
          {/* Backdrop */}
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

                  {/* === ADD MEMBER FORM (REUSED) === */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Member ID */}
                    <div className="flex flex-col">
                      <label className="text-sm">Member Id</label>
                      <input
                        disabled
                        type="text"
                        name="memberid"
                        value={form.memberid}
                        className="border rounded-lg p-2 bg-gray-100"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">First Name *</label>
                      <input
                        type="text"
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Last Name</label>
                      <input
                        type="text"
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Gender *</label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex flex-col">
                      <label className="text-sm">Date of Birth *</label>
                      <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Marital Status</label>
                      <select
                        name="marital_status"
                        value={form.marital_status}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      >
                        <option>Single</option>
                        <option>Married</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Phone *</label>
                      <input
                        type="text"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex flex-col">
                      <label className="text-sm">Alternate Phone</label>
                      <input
                        type="text"
                        name="alternate_mobile"
                        value={form.alternate_mobile}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Area *</label>
                      <input
                        type="text"
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex flex-col md:col-span-2">
                      <label className="text-sm">Address *</label>
                      <input
                        type="text"
                        name="address_line1"
                        value={form.address_line1}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Address 2</label>
                      <input
                        type="text"
                        name="address_line2"
                        value={form.address_line2}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex flex-col">
                      <label className="text-sm">City</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        className="border rounded-lg p-2 bg-transparent"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm">Status</label>
                      <select
                        name="isactive"
                        value={form.isactive ? "true" : "false"}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            isactive: e.target.value === "true",
                          })
                        }
                        className="border rounded-lg p-2 bg-transparent"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* ACTIONS */}
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
