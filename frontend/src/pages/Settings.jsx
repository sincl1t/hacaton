import React from "react";

export default function Settings() {
  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>Источники данных</h1>
      <p style={{ fontSize: 13, color: "#9da3b5", marginBottom: 16 }}>
        Здесь позже можно будет управлять подключениями к внешним источникам:
        YouTube, Telegram, VK, RSS и т.д. Сейчас это просто заглушка под будущее
        меню.
      </p>
      <ul style={{ fontSize: 13, color: "#c2c6d0", lineHeight: 1.5 }}>
        <li>YouTube Analytics API — статус: <b>подключено (мок)</b></li>
        <li>Telegram Bot / Analytics — статус: <b>в планах</b></li>
        <li>MWS Tables API — статус: <b>используется</b> (данные читаются через backend)</li>
      </ul>
    </div>
  );
}
