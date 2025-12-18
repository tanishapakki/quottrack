function StatCard({ title, value, highlight }) {
  const bgColor =
    highlight === "danger"
      ? "#ffe6e6"
      : highlight === "warning"
      ? "#fff4e5"
      : "#f4f4f4";

  return (
    <div
      style={{
        background: bgColor,
        padding: "16px",
        borderRadius: "8px",
        minWidth: "180px",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0" }}>{title}</h3>
      <p style={{ fontSize: "24px", margin: 0 }}>{value}</p>
    </div>
  );
}

export default StatCard;
