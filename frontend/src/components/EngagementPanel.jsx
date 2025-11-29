// frontend/src/components/EngagementPanel.jsx
import React, { useMemo } from "react";

function formatNumber(n) {
  if (!n && n !== 0) return "—";
  return n.toLocaleString("ru-RU");
}

export default function EngagementPanel({ stats }) {
  const {
    total_items,
    total_views,
    total_likes,
    total_comments,
    avg_engagement,
    avg_sentiment,
  } = stats || {};

  const metrics = useMemo(() => {
    if (!total_items || total_items === 0) {
      return {
        viewsPerItem: 0,
        likesPerItem: 0,
        commentsPerItem: 0,
      };
    }

    return {
      viewsPerItem: total_views / total_items,
      likesPerItem: total_likes / total_items,
      commentsPerItem: total_comments / total_items,
    };
  }, [total_items, total_views, total_likes, total_comments]);

  const maxPerItem = Math.max(
    metrics.viewsPerItem || 0,
    metrics.likesPerItem || 0,
    metrics.commentsPerItem || 0,
    1
  );

  const sentimentLabel = (() => {
    if (avg_sentiment == null) return "Нет данных";
    if (avg_sentiment <= -0.25) return "Сильно негативный фон";
    if (avg_sentiment <= 0.1) return "Сдержанно негативный";
    if (avg_sentiment <= 0.4) return "Скорее нейтральный";
    if (avg_sentiment <= 0.7) return "Умеренно позитивный";
    return "Очень позитивный фон";
  })();

  const sentimentColor = (() => {
    if (avg_sentiment == null) return "#6b7280"; // серый
    if (avg_sentiment <= -0.25) return "#f97373"; // красный
    if (avg_sentiment <= 0.1) return "#fb923c";  // оранжевый
    if (avg_sentiment <= 0.4) return "#e5e7eb";  // светло-серый
    if (avg_sentiment <= 0.7) return "#4ade80";  // зелёный
    return "#22c55e";                            // ярко-зелёный
  })();

  const engagementPercent =
    avg_engagement != null ? Math.min(Math.max(avg_engagement * 100, 0), 100) : null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1.3fr",
        gap: 16,
        marginTop: 8,
        alignItems: "stretch",
      }}
    >
      {/* Блок "Вовлечённость на единицу контента" */}
      <div
        style={{
          padding: 24,
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "linear-gradient(135deg, #16324a, #0f172a)",
          boxShadow: `
            0 0 38px rgba(100, 180, 255, 0.06),
            0 0 120px rgba(140, 90, 255, 0.05),
            inset 0 0 22px rgba(255,255,255,0.03)
          `,
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          Вовлечённость на единицу контента
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#9da3b5",
            marginBottom: 12,
          }}
        >
          Позволяет оценить «средний» материал: сколько в среднем просмотров,
          лайков и комментариев приходится на одну публикацию.
        </div>

        {[
          {
            key: "views",
            label: "Просмотры на материал",
            value: metrics.viewsPerItem,
            color: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
          },
          {
            key: "likes",
            label: "Лайки на материал",
            value: metrics.likesPerItem,
            color: "linear-gradient(90deg, #f97373, #fb7185)",
          },
          {
            key: "comments",
            label: "Комментарии на материал",
            value: metrics.commentsPerItem,
            color: "linear-gradient(90deg, #a855f7, #6366f1)",
          },
        ].map((row) => {
          const width =
            maxPerItem > 0 ? Math.max((row.value / maxPerItem) * 100, 4) : 4;

          return (
            <div key={row.key} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 4,
                  color: "#e5e7eb",
                }}
              >
                <span>{row.label}</span>
                <span style={{ opacity: 0.9 }}>
                  {row.value ? row.value.toFixed(1) : "—"}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: "#020617",
                  overflow: "hidden",
                  border: "1px solid rgba(148,163,184,0.35)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${width}%`,
                    backgroundImage: row.color,
                    boxShadow: "0 0 12px rgba(148,163,184,0.8), 0 0 24px rgba(148,163,184,0.4)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Блок "Настроение аудитории" */}
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          border: "1px solid #2b3040",
          backgroundColor: "#050814",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 4,
            }}
          >
            Настроение аудитории
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#9da3b5",
              marginBottom: 10,
            }}
          >
            Средний sentiment по всем материалам и короткая интерпретация.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: sentimentColor,
              boxShadow: `0 0 8px ${sentimentColor}`,
            }}
          />
          <div
            style={{
              fontSize: 12,
              color: "#e5e7eb",
            }}
          >
            {sentimentLabel}
          </div>
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            lineHeight: 1.1,
            marginBottom: 6,
          }}
        >
          {avg_sentiment != null ? avg_sentiment.toFixed(2) : "—"}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#9da3b5",
            marginBottom: 8,
          }}
        >
          Значение в диапазоне от −1 (максимально негативные реакции) до +1
          (максимально позитивные реакции).
        </div>

        {/* Линейная шкала настроения */}
        <div style={{ marginTop: 4 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "#6b7280",
              marginBottom: 2,
            }}
          >
            <span>Негатив</span>
            <span>Нейтрально</span>
            <span>Позитив</span>
          </div>
          <div
            style={{
              position: "relative",
              height: 8,
              borderRadius: 999,
              background:
                "linear-gradient(90deg, #f97373, #e5e7eb, #22c55e)",
              overflow: "hidden",
              opacity: 0.9,
            }}
          >
            {avg_sentiment != null && (
              <div
                style={{
                  position: "absolute",
                  top: -3,
                  width: 2,
                  height: 14,
                  borderRadius: 999,
                  backgroundColor: "#f9fafb",
                  boxShadow: "0 0 6px rgba(15,23,42,0.9)",
                  left: `${((avg_sentiment + 1) / 2) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
