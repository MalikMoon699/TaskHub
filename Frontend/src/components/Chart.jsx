import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import moment from "moment";

const Chart = ({ tasksData }) => {
  const [activeTab, setActiveTab] = useState("all");

  const dataset = useMemo(() => {
    if (!tasksData || tasksData.length === 0) return [];

    const startOfWeek = moment().startOf("isoWeek");
    const endOfWeek = moment().endOf("isoWeek");

    const grouped = {};
    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.clone().add(i, "days");
      grouped[date.format("YYYY-MM-DD")] = {
        date: date.format("YYYY-MM-DD"),
        weekday: date.format("ddd"),
        todo: 0,
        inprogress: 0,
        done: 0,
      };
    }

    tasksData.forEach((task) => {
      const updated = moment(task.updatedAt);
      if (updated.isBetween(startOfWeek, endOfWeek, null, "[]")) {
        const date = updated.format("YYYY-MM-DD");
        if (grouped[date]) grouped[date][task.status] += 1;
      }
    });

    return Object.values(grouped).map((day) => ({
      name: day.weekday,
      todo: day.todo,
      inprogress: day.inprogress,
      done: day.done,
    }));
  }, [tasksData]);

  const maxValue = useMemo(() => {
    if (!dataset || dataset.length === 0) return 1;

    if (activeTab === "all") {
      return Math.max(
        ...dataset.flatMap((day) => [day.todo, day.inprogress, day.done])
      );
    } else {
      return Math.max(...dataset.map((day) => day[activeTab]));
    }
  }, [dataset, activeTab]);

  const percentageDataset = useMemo(() => {
    if (!dataset || dataset.length === 0) return [];

    return dataset.map((day) => {
      const base = maxValue || 1;
      return {
        name: day.name,
        todo: (day.todo / base) * 100,
        inprogress: (day.inprogress / base) * 100,
        done: (day.done / base) * 100,
        raw: day,
      };
    });
  }, [dataset, maxValue]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontSize: "14px",
            color: "#333",
            width: "200px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
          {payload.map((entry) => {
            const rawValue = entry.payload?.raw?.[entry.dataKey] ?? entry.value;
            return (
              <p
                key={entry.dataKey}
                style={{
                  margin: "4px 0",
                  color: entry.color,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <span>
                  {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}
                </span>
                <span>{rawValue}</span>
              </p>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <div className="chart-header">
        <h2 className="chart-header-title">Tasks Chart</h2>
        <div className="tabs">
          <span
            onClick={() => setActiveTab("all")}
            className={`tab ${activeTab === "all" ? "active" : ""}`}
          >
            All
          </span>
          <span
            onClick={() => setActiveTab("todo")}
            className={`tab ${activeTab === "todo" ? "active" : ""}`}
          >
            Todo
          </span>
          <span
            onClick={() => setActiveTab("inprogress")}
            className={`tab ${activeTab === "inprogress" ? "active" : ""}`}
          >
            In Progress
          </span>
          <span
            onClick={() => setActiveTab("done")}
            className={`tab ${activeTab === "done" ? "active" : ""}`}
          >
            Done
          </span>
          <span className={`active-tab ${activeTab}`}></span>
        </div>
      </div>
      <div style={{ width: "100%", height: 400, marginLeft: "-17px" }}>
        <ResponsiveContainer key={activeTab} width="100%" height="100%">
          <ComposedChart
            data={percentageDataset}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />

            {(activeTab === "all" || activeTab === "done") && (
              <Area
                type="monotone"
                dataKey="done"
                fill="#2ecc702e"
                stroke="#2ecc71"
                dot={{
                  stroke: "#2ecc707e",
                  strokeWidth: 2,
                  r: 5,
                  fill: "#fff",
                }}
                activeDot={{ r: 5 }}
              />
            )}
            {(activeTab === "all" || activeTab === "todo") && (
              <Bar
                dataKey="todo"
                barSize={35}
                fill="#2c2ca4"
                radius={[8, 8, 8, 8]}
              />
            )}
            {(activeTab === "all" || activeTab === "inprogress") && (
              <Line
                type="monotone"
                dataKey="inprogress"
                stroke="#ff7300"
                dot={{ stroke: "#ff7300", strokeWidth: 2, r: 5, fill: "#fff" }}
                activeDot={{ r: 6 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
