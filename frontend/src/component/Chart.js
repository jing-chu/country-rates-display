import "../App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function Chart({ data }) {
  return (
    <LineChart
      width={800}
      height={300}
      data={data}
      margin={{
        top: 15,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis type="number"
        domain={['dataMin', 'dataMax']}
        tickFormatter={tick => {
          return tick.toPrecision(5);
        }}
      />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="Rate"
        stroke="#8884d8"
        strokeWidth={3}
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
}
