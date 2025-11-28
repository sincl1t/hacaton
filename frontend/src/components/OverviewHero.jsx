// frontend/src/components/OverviewHero.jsx
import React, { useMemo } from "react";

function formatNumberShort(n) {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("ru-RU");
}

function calcDelta(current, multiplier = 0.75) {
  const prev = Math.round((current || 0) * multiplier);
  const diff = (current || 0) - prev;
  const percent = prev > 0 ? (diff / prev) * 100 : 0;
  return {
    prev,
    diff,
    percent,
  };
}

export default function OverviewHero({ stats }) {
  const {
    total_views = 0,
    total_likes = 0,
    total_comments = 0,
    avg_engagement = 0,
  } = stats || {};

  const viewsDelta = useMemo(
    () => calcDelta(total_views, 0.75),
    [total_views]
  );
  const likesDelta = useMemo(
    () => calcDelta(total_likes, 0.7),
    [total_likes]
  );
  const commentsDelta = useMemo(
    () => calcDelta(total_comments, 0.8),
    [total_comments]
  );

  // Индекс эффективности → доля заполнения кольца (0–1)
  const efficiencyIndex = useMemo(() => {
    const e = avg_engagement || 0;
    return Math.min(Math.max(0.25 + e * 0.6, 0.05), 0.99);
  }, [avg_engagement]);

  const sweepDeg = 360 * efficiencyIndex;

  return (
    <div
      style={{
        marginBottom: 8,
        padding: 16,
        borderRadius: 16,
        border: "1px solid #1f2937",
        background:
          "radial-gradient(circle at top left, rgba(148,163,184,0.22), #020617)",
        display: "grid",
        gridTemplateColumns: "minmax(320px, 2fr) minmax(0, 3fr)",
        gap: 24,
        alignItems: "center",
      }}
    >
      {/* Левая часть — кольцевой индикатор + текст */}
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          minWidth: 0,
        }}
      >
 {/* Кольцо просмотров — увеличенный и контрастный */}
<div
  style={{
    width: 180,
    height: 180,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  }}
>
  <div
    style={{
      width: 180,
      height: 180,
      borderRadius: "50%",
      padding: 16,
      backgroundImage: `conic-gradient(
        #5cc6ff 0deg ${sweepDeg}deg,
        #0b1a27 ${sweepDeg}deg 360deg
      )`,
      boxShadow: "0 0 25px rgba(92,198,255,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        backgroundColor: "#020617",
        border: "1px solid rgba(148,163,184,0.35)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "6px 0",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#9da3b5",
          marginBottom: 2,
        }}
      >
        Просмотры
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: "#f8fafc",
        }}
      >
        {formatNumberShort(total_views)}
      </div>

      <div
        style={{
          fontSize: 11,
          color: "#5cc6ff",
          marginTop: 4,
          fontWeight: 500,
        }}
      >
        Эффективность {Math.round(efficiencyIndex * 100)}%
      </div>
    </div>
  </div>

  <div
    style={{
      fontSize: 11,
      color: "#9da3b5",
      marginTop: 4,
    }}
  >
    за выбранный период
  </div>
</div>


        {/* Текстовый блок рядом */}
        <div
          style={{
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#9da3b5",
              marginBottom: 4,
            }}
          >
            Social Media Overview
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Общий охват контента
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#cbd5f5",
              lineHeight: 1.5,
            }}
          >
            Суммарное количество просмотров всех материалов за выбранный
            период, с учётом текущей стратегии публикаций.
          </div>
        </div>
      </div>

      {/* Правая часть — мини-карточки по типам взаимодействий */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          minWidth: 0,
        }}
      >
        <MiniMetric
          label="Просмотры"
          value={total_views}
          delta={viewsDelta}
          color="#38bdf8"
        />
        <MiniMetric
          label="Лайки"
          value={total_likes}
          delta={likesDelta}
          color="#f97373"
        />
        <MiniMetric
          label="Комментарии"
          value={total_comments}
          delta={commentsDelta}
          color="#a855f7"
        />
      </div>
    </div>
  );
}

function MiniMetric({ label, value, delta, color }) {
  const positive = delta.diff >= 0;
  const arrow = positive ? "▲" : "▼";

  return (
    <div
      style={{
        borderRadius: 12,
        padding: 12,
        border: "1px solid #1f2937",
        background:
          "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.7))",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#9da3b5",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        {formatNumberShort(value)}
      </div>
      <div
        style={{
          fontSize: 11,
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: 2,
          color: positive ? "#4ade80" : "#f97373",
        }}
      >
        <span>{arrow}</span>
        <span>{Math.abs(delta.percent).toFixed(1)}%</span>
        <span
          style={{
            color: "#9da3b5",
            marginLeft: 2,
          }}
        >
          от {formatNumberShort(delta.prev)}
        </span>
      </div>
    </div>
  );
}
