import React, { useEffect, useState } from 'react';
import { fetchInstances, startInstance, stopInstance } from '../services/api';

const STATE_COLORS = {
  running: '#22c55e',
  stopped: '#ef4444',
  pending: '#f59e0b',
  stopping: '#f59e0b',
};

export default function EC2Instances({ onSelectInstance }) {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchInstances();
      setInstances(res.data);
    } catch (e) {
      setError('Failed to load instances. Check your AWS credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id, action) => {
    try {
      const fn = action === 'start' ? startInstance : stopInstance;
      const res = await fn(id);
      setActionMsg(res.data);
      setTimeout(() => { setActionMsg(''); load(); }, 2000);
    } catch (e) {
      setActionMsg('Action failed: ' + e.message);
    }
  };

  if (loading) return <p style={styles.info}>Loading EC2 instances...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div>
      <h2 style={styles.heading}>EC2 Instances ({instances.length})</h2>
      {actionMsg && <p style={styles.actionMsg}>{actionMsg}</p>}
      {instances.length === 0 && <p style={styles.info}>No instances found.</p>}
      <div style={styles.grid}>
        {instances.map(inst => (
          <div key={inst.instanceId} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.name}>{inst.name}</span>
              <span style={{ ...styles.badge, background: STATE_COLORS[inst.state] || '#888' }}>
                {inst.state}
              </span>
            </div>
            <div style={styles.detail}><b>ID:</b> {inst.instanceId}</div>
            <div style={styles.detail}><b>Type:</b> {inst.instanceType}</div>
            <div style={styles.detail}><b>Public IP:</b> {inst.publicIp || 'N/A'}</div>
            <div style={styles.detail}><b>Private IP:</b> {inst.privateIp || 'N/A'}</div>
            <div style={styles.detail}><b>AZ:</b> {inst.availabilityZone}</div>
            <div style={styles.detail}><b>Launched:</b> {inst.launchTime?.split('T')[0]}</div>
            <div style={styles.actions}>
              <button style={styles.btnBlue} onClick={() => onSelectInstance(inst.instanceId)}>
                View Metrics
              </button>
              {inst.state === 'stopped' && (
                <button style={styles.btnGreen} onClick={() => handleAction(inst.instanceId, 'start')}>
                  Start
                </button>
              )}
              {inst.state === 'running' && (
                <button style={styles.btnRed} onClick={() => handleAction(inst.instanceId, 'stop')}>
                  Stop
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  heading: { color: '#1e3a5f', marginBottom: 16 },
  info: { color: '#666' },
  error: { color: '#ef4444' },
  actionMsg: { background: '#dbeafe', color: '#1e40af', padding: '8px 12px', borderRadius: 6, marginBottom: 12 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  name: { fontWeight: 700, fontSize: 15, color: '#1e3a5f' },
  badge: { color: '#fff', borderRadius: 12, padding: '2px 10px', fontSize: 12, fontWeight: 600 },
  detail: { fontSize: 13, color: '#555', marginBottom: 4 },
  actions: { display: 'flex', gap: 8, marginTop: 12 },
  btnBlue: { flex: 1, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 0', cursor: 'pointer', fontSize: 13 },
  btnGreen: { flex: 1, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 0', cursor: 'pointer', fontSize: 13 },
  btnRed: { flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 0', cursor: 'pointer', fontSize: 13 },
};
