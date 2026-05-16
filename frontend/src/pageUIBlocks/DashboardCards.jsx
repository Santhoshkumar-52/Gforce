import React from "react";

const DashboardCards = ({ data }) => {
  // 🎨 Internal color system (UI responsibility)
  const cardStyles = [
    {
      // 🔵 Members
      bg: "bg-gradient-to-br from-blue-500/25 to-indigo-500/20",
      border: "border-blue-300/30",
      title: "text-blue-50",
      value: "text-white",
      iconBg: "bg-blue-500/40",
    },

    {
      // 🟢 Active
      bg: "bg-gradient-to-br from-emerald-500/25 to-green-500/20",
      border: "border-emerald-300/30",
      title: "text-emerald-50",
      value: "text-white",
      iconBg: "bg-emerald-500/40",
    },

    {
      // 🔴 Danger
      bg: "bg-gradient-to-br from-rose-500/25 to-red-500/20",
      border: "border-rose-300/30",
      title: "text-rose-50",
      value: "text-white",
      iconBg: "bg-rose-500/40",
    },

    {
      // 🟠 Warning
      bg: "bg-gradient-to-br from-amber-500/25 to-orange-500/20",
      border: "border-amber-300/30",
      title: "text-amber-50",
      value: "text-white",
      iconBg: "bg-amber-500/40",
    },

    {
      // 🟣 Purple
      bg: "bg-gradient-to-br from-violet-500/25 to-purple-500/20",
      border: "border-violet-300/30",
      title: "text-violet-50",
      value: "text-white",
      iconBg: "bg-violet-500/40",
    },

    {
      // 🩵 Cyan
      bg: "bg-gradient-to-br from-cyan-500/25 to-sky-500/20",
      border: "border-cyan-300/30",
      title: "text-cyan-50",
      value: "text-white",
      iconBg: "bg-cyan-500/40",
    },

    {
      // 🌸 Pink
      bg: "bg-gradient-to-br from-pink-500/25 to-fuchsia-500/20",
      border: "border-pink-300/30",
      title: "text-pink-50",
      value: "text-white",
      iconBg: "bg-pink-500/40",
    },

    {
      // ⚫ Neutral
      bg: "bg-gradient-to-br from-slate-500/25 to-zinc-500/20",
      border: "border-zinc-300/30",
      title: "text-zinc-50",
      value: "text-white",
      iconBg: "bg-zinc-500/40",
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
