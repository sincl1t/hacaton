// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getSummary } from "../api";
import EngagementPanel from "../components/EngagementPanel";
import StatsCharts from "../components/StatsCharts";
import OverviewHero from "../components/OverviewHero";
import FilterBar from "../components/FilterBar";
import SummaryStrip from "../components/SummaryStrip";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [network, setNetwork] = useState("all");
  const [period, setPeriod] = useState("7d");

  useEffect(() => {
    // пока фильтры только на UI – запрос один и тот же
    getSummary()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загружаю сводку…</div>;
  if (!stats) return <div>Нет данных</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Dashboard</h1>
      <p style={{ fontSize: 13, color: "#9da3b5" }}>
        Быстрый обзор эффективности контента за выбранный период.
      </p>

      {/* Фильтры по соцсети и периоду */}
      <FilterBar
        network={network}
        period={period}
        onNetworkChange={setNetwork}
        onPeriodChange={setPeriod}
      />

      {/* Hero-блок с общим охватом */}
      <OverviewHero stats={stats} />

      {/* Полоса-резюме по выбранному периоду */}
      <SummaryStrip stats={stats} periodKey={period} />

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
