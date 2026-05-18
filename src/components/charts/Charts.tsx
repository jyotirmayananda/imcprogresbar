"use client";

import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart as RechartsLineChart, Line,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';

export function BarChart({ data, xKey, yKey, color = "#22C55E" }: any) {
  const chartWidth = Math.max(800, data?.length * 40); // Dynamic width based on data points
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
      <div style={{ width: data?.length > 20 ? chartWidth : '100%', minWidth: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey={xKey} stroke="#64748b" tick={{ fill: '#64748b' }} />
            <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: 'rgba(0,0,0,0.1)', color: '#0f172a', borderRadius: '8px' }} />
            <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LineChart({ data, xKey, yKey, color = "#0D9488" }: any) {
  const chartWidth = Math.max(800, data?.length * 40); // Dynamic width based on data points
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
      <div style={{ width: data?.length > 20 ? chartWidth : '100%', minWidth: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey={xKey} stroke="#64748b" tick={{ fill: '#64748b' }} />
            <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: 'rgba(0,0,0,0.1)', color: '#0f172a', borderRadius: '8px' }} />
            <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={3} dot={{ r: 4, fill: color }} activeDot={{ r: 6 }} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const COLORS = ['#22C55E', '#0D9488', '#FF6B6B', '#FCA311', '#4D908E'];

export function PieChart({ data, nameKey, valueKey }: any) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey={valueKey}
          nameKey={nameKey}
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: 'rgba(0,0,0,0.1)', color: '#0f172a', borderRadius: '8px' }} />
        <Legend wrapperStyle={{ color: '#475569' }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
