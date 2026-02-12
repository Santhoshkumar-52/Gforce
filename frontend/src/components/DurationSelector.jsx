import { useEffect } from "react";

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

  const handleChange = (e) => {
    const { startdate, enddate } = handledate(e.target.value);
    onChangeDuration(startdate, enddate);
  };

  return (
    <select
      defaultValue="today"
      onChange={handleChange}
      className="rounded-lg p-2 bg-transparent border border-gray-400 outline-none cursor-pointer w-50"
    >
      <option value="today">Today</option>
      <option value="ytdy">Yesterday</option>
      <option value="last7">Last 7 Days</option>
      <option value="last14">Last 14 Days</option>
      <option value="month">This Month</option>
    </select>
  );
};

export default DurationSelector;
