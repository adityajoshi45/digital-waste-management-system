const colors = {
  green: "bg-green-50 text-green-600",
  blue: "bg-blue-50 text-blue-600",
  yellow: "bg-yellow-50 text-yellow-600",
  purple: "bg-purple-50 text-purple-600",
  red: "bg-red-50 text-red-600",
};

const StatCard = ({ title, value, icon, color = "green" }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <p className="text-gray-500 text-sm">{title}</p>
      <span className={`p-2 rounded-lg ${colors[color]}`}>{icon}</span>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default StatCard;
