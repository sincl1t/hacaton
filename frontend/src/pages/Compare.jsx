import React, { useState } from "react";
import { postCompare } from "../api";

export default function Compare() {
  const [idsInput, setIdsInput] = useState("1,2");
  const [items, setItems] = useState([]);

  const handleCompare = () => {
    const ids = idsInput
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter(Boolean);
    if (!ids.length) return;
    postCompare(ids).then((res) => setItems(res.data));
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>Сравнение публикаций</h1>
      <p style={{ fontSize: 13, color: "#9da3b5", marginBottom: 12 }}>
        Введи id публикаций через запятую (из реестра), чтобы сравнить их
        метрики.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={idsInput}
          onChange={(e) => setIdsInput(e.target.value)}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #2b3040",
            backgroundColor: "#05060a",
            color: "#fff",
            fontSize: 13,
          }}
        />
        <button
          onClick={handleCompare}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#d94e68",
            color: "#fff",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Сравнить
        </button>
      </div>

      {items.length > 0 && (
        <div
          style={{
            borderRadius: 12,
            border: "1px solid #2b3040",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              fontSize: 12,
              borderCollapse: "collapse",
            }}
          >
            <thead style={{ backgroundColor: "#0a0f18" }}>
              <tr>
                <th style={{ padding: 8, textAlign: "left" }}>ID</th>
                <th style={{ padding: 8, textAlign: "left" }}>Заголовок</th>
                <th style={{ padding: 8, textAlign: "right" }}>Просмотры</th>
                <th style={{ padding: 8, textAlign: "right" }}>ER</th>
                <th style={{ padding: 8, textAlign: "right" }}>Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td style={{ padding: 8 }}>{i.id}</td>
                  <td style={{ padding: 8 }}>{i.title}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    {i.views.toLocaleString("ru-RU")}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    {(i.engagement_rate * 100).toFixed(1)}%
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    {i.sentiment.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
