// frontend/src/components/SummaryStrip.jsx
import React, { useMemo } from "react";

function formatDateRange(periodKey) {
  const today = new Date();
  const end = today;
  const start = new Date(today);

  if (periodKey === "7d") start.setDate(today.getDate() - 6);
  else if (periodKey === "30d") start.setDate(today.getDate() - 29);
  else if (periodKey === "month") start.setDate(1);
  else start.setDate(today.getDate() - 6);

  const fmt = (d) =>
    d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return `${fmt(start)} – ${fmt(end)}`;
}

export default function SummaryStrip({ stats, periodKey }) {
  const periodLabel = useMemo(
    () => formatDateRange(periodKey),
    [periodKey]
  );

  const avgEngPercent =
    stats?.avg_engagement != null
      ? (stats.avg_engagement * 100).toFixed(1) + "%"
      : "—";

  const sentiment =
    stats?.avg_sentiment != null
      ? stats.avg_sentiment.toFixed(2)
      : "—";

  return (
    <div
      style={{
        marginTop: 20,
        padding: "20px 24px",
        borderRadius: 16,
        border: "1px solid #1f2937",                    // ← рамка!
        background:
        "linear-gradient(145deg, rgba(34,45,72,0.45), rgba(15,20,31,0.55) 35%, rgba(5,8,14,0.85) 100%)",

        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 18,
      }}
    >
      <PeriodBlock label="Выбранный период" value={periodLabel} />

      <MetricBlock
        label="Всего публикаций"
        value={stats?.total_items ?? "—"}
      />

      <MetricBlock label="Средний engagement" value={avgEngPercent} />

      <MetricBlock label="Средний sentiment" value={sentiment} />
    </div>
  );
}

function PeriodBlock({ label, value }) {
  return (
    <div
      style={{
        padding: "4px 6px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "#6b7280",
          fontWeight: 400,
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: 13,
          color: "#94a3b8",
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function MetricBlock({ label, value }) {
  return (
    <div
      style={{
        padding: "4px 6px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "#6b7280",
          fontWeight: 400,
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: "#f1f5f9",
          letterSpacing: "-0.2px",
        }}
      >
        {value}
      </span>
    </div>
  );
}
