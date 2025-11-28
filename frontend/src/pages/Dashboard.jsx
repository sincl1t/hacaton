// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getSummary } from "../api";
import KpiCard from "../components/KpiCard";
import EngagementPanel from "../components/EngagementPanel";
import StatsCharts from "../components/StatsCharts";
import OverviewHero from "../components/OverviewHero";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSummary()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загружаю сводку…</div>;
  if (!stats) return <div>Нет данных</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Dashboard</h1>
      <p style={{ fontSize: 13, color: "#9da3b5" }}>
        Быстрый обзор эффективности контента за выбранный период.
      </p>

      {/* Новый hero-блок в стиле "Social Media Overview" */}
      <OverviewHero stats={stats} />

      {/* KPI карточки */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <KpiCard label="Всего публикаций" value={stats.total_items} />
        <KpiCard
          label="Просмотры"
          value={stats.total_views.toLocaleString("ru-RU")}
        />
        <KpiCard
          label="Лайки"
          value={stats.total_likes.toLocaleString("ru-RU")}
        />
        <KpiCard
          label="Комментарии"
          value={stats.total_comments.toLocaleString("ru-RU")}
        />
        <KpiCard
          label="Средний engagement"
          value={(stats.avg_engagement * 100).toFixed(1) + "%"}
        />
        <KpiCard
          label="Средний sentiment"
          value={stats.avg_sentiment.toFixed(2)}
        />
      </div>

      {/* Инфографика: вовлечённость + настроение аудитории */}
      <EngagementPanel stats={stats} />

      {/* График + круговая диаграмма по структуре активности */}
      <StatsCharts stats={stats} />

      {/* Блок с LLM-инсайтами */}
      <div
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 12,
          border: "1px solid #2b3040",
          backgroundColor: "#0a0f18",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Инсайты от LLM (заглушка)
        </div>
        <p style={{ fontSize: 13, color: "#c2c6d0", lineHeight: 1.5 }}>
          Здесь будет текстовый анализ динамики просмотров, вовлечённости и
          настроения аудитории. Бэкенд передаст в LLM сводные метрики —
          модель вернёт интерпретацию, которую увидит контент-менеджер.
        </p>
      </div>
    </div>
  );
}
