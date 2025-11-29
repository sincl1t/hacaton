// frontend/src/components/FilterBar.jsx
import React from "react";

const NETWORK_OPTIONS = [
  { value: "all", label: "Все соцсети" },
  { value: "vk", label: "VK" },
  { value: "tg", label: "Telegram" },
  { value: "yt", label: "YouTube" },
  { value: "tt", label: "TikTok" },
  { value: "ig", label: "Instagram" },
];

const PERIOD_OPTIONS = [
  { value: "7d", label: "Последние 7 дней" },
  { value: "30d", label: "Последние 30 дней" },
  { value: "month", label: "Текущий месяц" },
  { value: "custom", label: "Произвольный период" },
];

export default function FilterBar({
  network,
  period,
  onNetworkChange,
  onPeriodChange,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        marginBottom: 12,
        flexWrap: "wrap",
      }}
    >
      <FilterSelect
        label="выбрать соцсеть"
        value={network}
        options={NETWORK_OPTIONS}
        onChange={onNetworkChange}
      />
      <FilterSelect
        label="выбрать период"
        value={period}
        options={PERIOD_OPTIONS}
        onChange={onPeriodChange}
      />
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontSize: 11,
          color: "#6b7280",
          marginLeft: 4,
          textTransform: "uppercase",
          letterSpacing: 0.08,
        }}
      >
        {label}
      </span>

      <div style={{ position: "relative", width: 210 }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            height: 40,
            padding: "0 40px 0 14px",
            borderRadius: 10,
            border: "1px solid #2b3345",
            background:
              "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.85))",
            color: "#f1f5f9",
            fontSize: 14,
            cursor: "pointer",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{
                backgroundColor: "#020617",
                color: "#e2e8f0",
              }}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* стрелка */}
        <span
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
            fontSize: 11,
            pointerEvents: "none",
          }}
        >
          ▼
        </span>
      </div>
    </div>
  );
}
