import React, { useContext, useEffect } from "react";
import CommonValueContext from "../layouts/CommonvalueContext";

const Clientdropdown = ({ onChangeClient }) => {
  const { branchids, setclientids, branchid } = useContext(CommonValueContext);

  useEffect(() => {
    setclientids();
  }, []);

  const handleChange = (e) => {
    onChangeClient(e.target.value);
  };

  return (
    <select
      name="plan"
      onChange={handleChange}
      className="rounded-lg p-2 bg-transparent border border-gray-400 outline-none cursor-pointer w-50"
    >
      {branchids.map((branch) => (
        <option key={branch._id} value={branch._id}>
          {branch.branchname}
        </option>
      ))}
    </select>
  );
};

export default Clientdropdown;
