import React, { useMemo } from "react";
import { LineChart } from "@mui/x-charts";

const Chart = ({ tasksData }) => {
  const dataset = useMemo(() => {
    const grouped = {};

    tasksData.forEach((task) => {
      const date = task.dueDate.split("T")[0];
      if (!grouped[date])
        grouped[date] = { date, todo: 0, inprogress: 0, done: 0 };
      grouped[date][task.status] += 1;
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [tasksData]);

  return (
    <div>
      <LineChart
        dataset={dataset}
        xAxis={[{ dataKey: "date", scaleType: "band", label: "Due Date" }]}
        // yAxis={[{ label: "Tasks Count" }]}
        series={[
          { dataKey: "todo", label: "Todo", showMark: true },
          { dataKey: "inprogress", label: "In Progress", showMark: true },
          { dataKey: "done", label: "Done", showMark: true },
        ]}
        height={500}
        // width={700}
        slotProps={{ legend: { hidden: true } }}
        slots={{ legend: () => null }}
        grid={{ vertical: true, horizontal: true }}
      />
    </div>
  );
};

export default Chart;
