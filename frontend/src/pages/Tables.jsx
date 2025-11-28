// frontend/src/pages/Tables.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const TABLE_TEMPLATES = {
  contentPlan: {
    name: "Контент-план",
    headers: ["Дата", "Платформа", "Формат", "Тема", "Статус", "Ответственный", "Ссылка"],
  },
  weeklyKpi: {
    name: "KPI по неделям",
    headers: ["Неделя", "Просмотры", "Лайки", "Комментарии", "CTR, %", "Примечания"],
  },
  experiments: {
    name: "Эксперименты",
    headers: ["Гипотеза", "Тип контента", "Период", "Метрика до", "Метрика после", "Вывод"],
  },
};

function createEmptyGrid(rows = 5, cols = 5) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => "")
  );
}

function createTemplateGrid(headers, rows = 10) {
  const cols = headers.length;
  const data = [];
  data.push(headers);
  for (let i = 0; i < rows; i++) {
    data.push(Array.from({ length: cols }, () => ""));
  }
  return data;
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("ru-RU");
  } catch {
    return iso;
  }
}

function getNumericSummary(table) {
  if (!table || !table.data || table.data.length < 2) return null;
  const [headerRow, ...rows] = table.data;
  const cols = headerRow.length;

  const sums = Array(cols).fill(0);
  const counts = Array(cols).fill(0);

  rows.forEach((row) => {
    row.forEach((value, idx) => {
      if (value === null || value === undefined || value === "") return;
      const num = Number(
        value
          .toString()
          .replace(/\s/g, "")
          .replace(",", ".")
      );
      if (!Number.isNaN(num)) {
        sums[idx] += num;
        counts[idx] += 1;
      }
    });
  });

  const stats = [];
  for (let i = 0; i < cols; i++) {
    if (counts[i] === 0) continue;
    stats.push({
      label: headerRow[i] || `Колонка ${i + 1}`,
      sum: sums[i],
      avg: sums[i] / counts[i],
    });
  }
  return stats;
}

export default function Tables() {
  const { user } = useAuth();
  const email = user?.email;

  const storageKey = email ? `userTables:${email}` : null;

  const [tables, setTables] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // --- загрузка из localStorage ---
  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setTables(parsed);
        if (parsed.length > 0) {
          setSelectedId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error("Tables load error", e);
    }
  }, [storageKey]);

  // --- сохранение в localStorage ---
  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(tables));
    } catch (e) {
      console.error("Tables save error", e);
    }
  }, [tables, storageKey]);

  const selectedTable = tables.find((t) => t.id === selectedId) || null;
  const summary = selectedTable ? getNumericSummary(selectedTable) : null;

  const handleCreateTable = () => {
    const now = new Date().toISOString();
    const newTable = {
      id: String(Date.now()),
      name: `Таблица ${tables.length + 1}`,
      createdAt: now,
      updatedAt: now,
      data: createEmptyGrid(),
    };
    setTables((prev) => [...prev, newTable]);
    setSelectedId(newTable.id);
  };

  const handleCreateFromTemplate = (templateKey) => {
    const tpl = TABLE_TEMPLATES[templateKey];
    if (!tpl) return;
    const now = new Date().toISOString();
    const newTable = {
      id: String(Date.now()),
      name: tpl.name,
      createdAt: now,
      updatedAt: now,
      data: createTemplateGrid(tpl.headers),
    };
    setTables((prev) => [...prev, newTable]);
    setSelectedId(newTable.id);
  };

  const handleDeleteTable = (id) => {
    setTables((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      if (filtered.length === 0) {
        setSelectedId(null);
      } else if (id === selectedId) {
        setSelectedId(filtered[0].id);
      }
      return filtered;
    });
  };

  const updateSelectedTable = (updater) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== selectedId) return t;
        const updated = updater(t);
        return {
          ...updated,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const handleRename = (e) => {
    const value = e.target.value;
    updateSelectedTable((t) => ({ ...t, name: value }));
  };

  const handleCellChange = (rowIdx, colIdx, value) => {
    updateSelectedTable((t) => {
      const nextData = t.data.map((row, r) =>
        row.map((cell, c) =>
          r === rowIdx && c === colIdx ? value : cell
        )
      );
      return { ...t, data: nextData };
    });
  };

  const handleAddRow = () => {
    updateSelectedTable((t) => {
      const cols = t.data[0]?.length || 5;
      const newRow = Array.from({ length: cols }, () => "");
      return { ...t, data: [...t.data, newRow] };
    });
  };

  const handleAddColumn = () => {
    updateSelectedTable((t) => {
      const nextData = t.data.map((row) => [...row, ""]);
      return { ...t, data: nextData };
    });
  };

  const handleRemoveRow = () => {
    updateSelectedTable((t) => {
      if (t.data.length <= 1) return t;
      const nextData = t.data.slice(0, t.data.length - 1);
      return { ...t, data: nextData };
    });
  };

  const handleRemoveColumn = () => {
    updateSelectedTable((t) => {
      if (!t.data[0] || t.data[0].length <= 1) return t;
      const nextData = t.data.map((row) => row.slice(0, row.length - 1));
      return { ...t, data: nextData };
    });
  };

  if (!email) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Таблицы</h1>
        <p style={{ fontSize: 13, color: "#9da3b5" }}>
          Для работы с таблицами необходимо войти в систему.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: 16,
      }}
    >
      {/* ЛЕВАЯ ПАНЕЛЬ — список таблиц */}
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          border: "1px solid #2b3040",
          backgroundColor: "#050814",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: 320,
        }}
      >
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 4,
  }}
>
  <h2 style={{ fontSize: 16 }}>Мои таблицы</h2>

  <div
    style={{
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
    }}
  >
    <button
      onClick={handleCreateTable}
      style={{
        fontSize: 12,
        padding: "6px 12px",
        borderRadius: 6,
        border: "1px solid #3b82f6",
        background: "#0b1120",
        color: "#e5e7eb",
        cursor: "pointer",
      }}
    >
      + пустая
    </button>

    <select
      defaultValue=""
      onChange={(e) => {
        if (!e.target.value) return;
        handleCreateFromTemplate(e.target.value);
        e.target.value = "";
      }}
      style={{
        fontSize: 12,
        padding: "6px 10px",
        borderRadius: 6,
        border: "1px solid #374151",
        background: "#020617",
        color: "#e5e7eb",
        cursor: "pointer",
      }}
    >
      <option value="">шаблон…</option>
      <option value="contentPlan">Контент-план</option>
      <option value="weeklyKpi">KPI по неделям</option>
      <option value="experiments">Эксперименты</option>
    </select>
  </div>
</div>

        {tables.length === 0 && (
          <p style={{ fontSize: 13, color: "#9da3b5" }}>
            Пока нет ни одной таблицы. Создайте первую, чтобы начать.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {tables.map((t) => {
            const isActive = t.id === selectedId;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                style={{
                  padding: 8,
                  borderRadius: 10,
                  border: isActive
                    ? "1px solid #3b82f6"
                    : "1px solid #1f2937",
                  backgroundColor: isActive ? "#0b1120" : "#020617",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#e5e7eb",
                      marginBottom: 2,
                    }}
                  >
                    {t.name || "Без названия"}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                    }}
                  >
                    Обновлено: {formatDate(t.updatedAt)}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTable(t.id);
                  }}
                  style={{
                    fontSize: 11,
                    padding: "2px 6px",
                    borderRadius: 999,
                    border: "1px solid #4b5563",
                    background: "transparent",
                    color: "#9ca3af",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ — редактор таблицы */}
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          border: "1px solid #2b3040",
          backgroundColor: "#050814",
          minHeight: 320,
          overflow: "auto",
        }}
      >
        <h1 style={{ fontSize: 20, marginBottom: 4 }}>Редактор таблиц</h1>
        <p style={{ fontSize: 13, color: "#9da3b5", marginBottom: 12 }}>
          Простая таблица с локальным сохранением. Данные не уходят на сервер и
          привязаны к вашему аккаунту на этом устройстве.
        </p>

        {!selectedTable && (
          <p style={{ fontSize: 13, color: "#9da3b5" }}>
            Выберите таблицу слева или создайте новую.
          </p>
        )}

        {selectedTable && (
          <>
            {/* мини-аналитика по числам */}
            {summary && summary.length > 0 && (
              <div
                style={{
                  marginBottom: 12,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #1f2937",
                  backgroundColor: "#020617",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {summary.slice(0, 4).map((col) => (
                  <div
                    key={col.label}
                    style={{
                      minWidth: 140,
                      fontSize: 11,
                      color: "#e5e7eb",
                    }}
                  >
                    <div style={{ color: "#9ca3af", marginBottom: 2 }}>
                      {col.label}
                    </div>
                    <div>Σ: {col.sum.toLocaleString("ru-RU")}</div>
                    <div>avg: {col.avg.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* заголовок + управление */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                value={selectedTable.name}
                onChange={handleRename}
                placeholder="Название таблицы"
                style={{
                  fontSize: 14,
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  flex: 1,
                  minWidth: 220,
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  whiteSpace: "nowrap",
                }}
              >
                Обновлено: {formatDate(selectedTable.updatedAt)}
              </div>
            </div>

            {/* кнопки управления размером */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <button onClick={handleAddRow} style={btnSmStyle}>
                + строка
              </button>
              <button onClick={handleRemoveRow} style={btnSmStyle}>
                − строка
              </button>
              <button onClick={handleAddColumn} style={btnSmStyle}>
                + столбец
              </button>
              <button onClick={handleRemoveColumn} style={btnSmStyle}>
                − столбец
              </button>
            </div>

            {/* сама таблица */}
            <div
              style={{
                borderRadius: 10,
                border: "1px solid #1f2937",
                overflow: "auto",
                backgroundColor: "#020617",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  minWidth: "100%",
                }}
              >
                <tbody>
                  {selectedTable.data.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, colIdx) => (
                        <td
                          key={colIdx}
                          style={{
                            border: "1px solid #111827",
                            padding: 0,
                          }}
                        >
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) =>
                              handleCellChange(
                                rowIdx,
                                colIdx,
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              border: "none",
                              outline: "none",
                              backgroundColor:
                                rowIdx === 0 ? "#020617" : "transparent",
                              fontWeight: rowIdx === 0 ? 600 : 400,
                              color: "#e5e7eb",
                              fontSize: 13,
                              padding: "6px 8px",
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const btnSmStyle = {
  fontSize: 12,
  padding: "4px 10px",
  borderRadius: 999,
  border: "1px solid #4b5563",
  background: "#020617",
  color: "#e5e7eb",
  cursor: "pointer",
};
