import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchCpuMetrics, fetchNetworkIn, fetchNetworkOut } from '../services/api';

export default function MetricsChart({ instanceId, onBack }) {
  const [cpu, setCpu] = useState(null);
  const [netIn, setNetIn] = useState(null);
  const [netOut, setNetOut] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!instanceId) return;
    setLoading(true);
    Promise.all([
      fetchCpuMetrics(instanceId),
      fetchNetworkIn(instanceId),
      fetchNetworkOut(instanceId),
    ])
      .then(([c, ni, no]) => {
        setCpu(c.data);
        setNetIn(ni.data);
        setNetOut(no.data);
      })
      .catch(() => setError('Failed to load metrics.'))
      .finally(() => setLoading(false));
  }, [instanceId]);

  const formatChart = (metric) =>
    metric?.dataPoints?.map(dp => ({
      time: dp.timestamp?.split('T')[1]?.slice(0, 5),
      value: parseFloat(dp.value?.toFixed(2) || 0),
    })) || [];

  if (loading) return <p style={{ color: '#666' }}>Loading CloudWatch metrics for {instanceId}...</p>;
  if (error) return <p style={{ color: '#ef4444' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <button onClick={onBack} style={styles.backBtn}>← Back</button>
        <h2 style={{ color: '#1e3a5f', margin: 0 }}>Metrics: {instanceId}</h2>
      </div>

      <MetricCard title="CPU Utilization (%)" data={formatChart(cpu)} color="#3b82f6" />
      <MetricCard title="Network In (Bytes)" data={formatChart(netIn)} color="#22c55e" />
      <MetricCard title="Network Out (Bytes)" data={formatChart(netOut)} color="#f59e0b" />
    </div>
  );
}

function MetricCard({ title, data, color }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.chartTitle}>{title}</h3>
      {data.length === 0
        ? <p style={{ color: '#888', fontSize: 13 }}>No data available for the last hour.</p>
        : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} name={title} />
            </LineChart>
          </ResponsiveContainer>
        )
      }
    </div>
  );
}

const styles = {
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, marginBottom: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
  chartTitle: { color: '#1e3a5f', marginBottom: 12, fontSize: 15 },
  backBtn: { background: '#e2e8f0', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13, color: '#333' },
};
