import React from "react";

const DashboardCards = ({ data }) => {
  // 🎨 Internal color system (UI responsibility)
  const cardStyles = [
    {
      bg: "bg-indigo-500/15",
      border: "border-indigo-400/30",
      title: "text-indigo-200",
      value: "text-indigo-100",
      iconBg: "bg-indigo-500/30",
    },
    {
      bg: "bg-emerald-500/15",
      border: "border-emerald-400/30",
      title: "text-emerald-200",
      value: "text-emerald-100",
      iconBg: "bg-emerald-500/30",
    },
    {
      bg: "bg-red-500/15",
      border: "border-red-400/30",
      title: "text-red-200",
      value: "text-red-100",
      iconBg: "bg-red-500/30",
    },
    {
      bg: "bg-amber-500/15",
      border: "border-amber-400/30",
      title: "text-amber-200",
      value: "text-amber-100",
      iconBg: "bg-amber-500/30",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((card, index) => {
        const style = cardStyles[index % cardStyles.length];

        return (
          <div
            key={index}
            className={`p-5 rounded-2xl shadow-md border backdrop-blur-md transition-all duration-200 hover:scale-[1.02] ${style.bg} ${style.border}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm ${style.title}`}>{card.title}</p>

                <h2 className={`text-2xl font-semibold ${style.value}`}>
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-11 h-11 flex items-center justify-center rounded-xl ${style.iconBg}`}
              >
                <span className="text-lg text-white">{card.icon || "📊"}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
