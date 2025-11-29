// frontend/src/components/StatsCharts.jsx
import React, { useMemo } from "react";

function buildTimeSeries(stats) {
  if (!stats) return [];

  const { total_views, total_likes, total_comments } = stats;
  const days = 7;

  // фиксированный паттерн, чтобы график не "прыгал"
  const pattern = [0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.22];

  const today = new Date();
  const series = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const label = d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    });

    const p = pattern[days - 1 - i];

    series.push({
      label,
      views: Math.round((total_views || 0) * p),
      likes: Math.round((total_likes || 0) * p),
      comments: Math.round((total_comments || 0) * p),
    });
  }

  return series;
}

export default function StatsCharts({ stats }) {
  const timeSeries = useMemo(() => buildTimeSeries(stats), [stats]);

  const totals = useMemo(() => {
    if (!stats) {
      return {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        gradient: "conic-gradient(#111827 0 100%)",
      };
    }

    const totalViews = stats.total_views || 0;
    const totalLikes = stats.total_likes || 0;
    const totalComments = stats.total_comments || 0;

    const sum = totalViews + totalLikes + totalComments || 1;

    const vPct = (totalViews / sum) * 100;
    const lPct = (totalLikes / sum) * 100;
    const cPct = (totalComments / sum) * 100;

    const gradient = `conic-gradient(
      #38bdf8 0 ${vPct}%,
      #f97373 ${vPct}% ${vPct + lPct}%,
      #a855f7 ${vPct + lPct}% 100%
    )`;

    return {
      totalViews,
      totalLikes,
      totalComments,
      gradient,
      vPct,
      lPct,
      cPct,
    };
  }, [stats]);

  const maxViews = useMemo(() => {
    if (!timeSeries.length) return 1;
    return Math.max(...timeSeries.map((d) => d.views), 1);
  }, [timeSeries]);

  return (
    <div
      style={{
        marginTop: 16,
        display: "grid",
        gridTemplateColumns: "2fr 1.2fr",
        gap: 16,
      }}
    >
      {/* Мини-график просмотров по дням (бар-чарт) */}
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          border: "1px solid #2b3040",
          background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.18), #050814)",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          Динамика просмотров
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#9da3b5",
            marginBottom: 10,
          }}
        >
          Быстрый просмотр распределения просмотров за последние 7 дней
          (синтетический ряд из сводной статистики).
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            height: 180,
            paddingTop: 8,
            paddingBottom: 4,
          }}
        >
          {timeSeries.map((d, idx) => {
            const minBar = 16; // минимальная высота бара, чтобы его было видно
            const maxBar = 140; // максимальная высота бара
            const ratio = maxViews > 0 ? d.views / maxViews : 0;
            const heightPx = minBar + (maxBar - minBar) * ratio;

            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                style={{
                  width: "100%",
                  height: `${heightPx}px`,
                  borderRadius: 14,
                  background: `
                    linear-gradient(180deg,
                      rgba(61,186,242,0.92) 0%,
                      rgba(61,186,242,0.55) 55%,
                      rgba(61,186,242,0.25) 78%,
                      rgba(61,186,242,0.08) 100%
                    )
                  `,
                  boxShadow: `
                    0 4px 18px rgba(61,186,242,0.28),
                    inset 0 -4px 10px rgba(0,0,0,0.18)
                  `,
                  transition: "0.25s ease",
                }}
              />

                <div
                  style={{
                    fontSize: 10,
                    color: "#9da3b5",
                    textAlign: "center",
                  }}
                >
                  {d.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Круговая диаграмма структуры вовлечённости */}
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          border: "1px solid #2b3040",
          backgroundColor: "#050814",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          justifyContent: "space-between",
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
            Структура взаимодействий
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#9da3b5",
              marginBottom: 10,
            }}
          >
            Соотношение просмотров, лайков и комментариев в общей активности
            пользователей.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          {/* Донат-чарт через conic-gradient */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundImage: totals.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              boxShadow: "0 0 18px rgba(15,23,42,0.9)",
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: "#050814",
                border: "1px solid rgba(148,163,184,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                fontSize: 11,
                color: "#e5e7eb",
              }}
            >
              <div style={{ fontSize: 10, color: "#9da3b5" }}>Всего</div>
              <div style={{ fontWeight: 600 }}>
                {(
                  (totals.totalViews || 0) +
                  (totals.totalLikes || 0) +
                  (totals.totalComments || 0)
                ).toLocaleString("ru-RU")}
              </div>
            </div>
          </div>

          {/* Легенда */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 12,
              color: "#e5e7eb",
            }}
          >
            <LegendRow
              color="#38bdf8"
              label="Просмотры"
              value={totals.totalViews}
              percent={totals.vPct}
            />
            <LegendRow
              color="#f97373"
              label="Лайки"
              value={totals.totalLikes}
              percent={totals.lPct}
            />
            <LegendRow
              color="#a855f7"
              label="Комментарии"
              value={totals.totalComments}
              percent={totals.cPct}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendRow({ color, label, value, percent }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
        <span>{label}</span>
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#cbd5f5",
          textAlign: "right",
        }}
      >
        <div>{value != null ? value.toLocaleString("ru-RU") : "—"}</div>
        {percent != null && (
          <div style={{ color: "#9da3b5" }}>{percent.toFixed(1)}%</div>
        )}
      </div>
    </div>
  );
}
