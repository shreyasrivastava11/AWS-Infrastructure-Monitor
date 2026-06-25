import React, { useState } from 'react';
import EC2Instances from './components/EC2Instances';
import S3Buckets from './components/S3Buckets';
import MetricsChart from './components/MetricsChart';

const TABS = ['EC2 Instances', 'S3 Buckets'];

export default function App() {
  const [activeTab, setActiveTab] = useState('EC2 Instances');
  const [selectedInstance, setSelectedInstance] = useState(null);

  const handleSelectInstance = (id) => {
    setSelectedInstance(id);
    setActiveTab('Metrics');
  };

  const handleBack = () => {
    setSelectedInstance(null);
    setActiveTab('EC2 Instances');
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>☁️ AWS Infrastructure Monitor</div>
          <div style={styles.subtitle}>Spring Boot + React + AWS SDK</div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={styles.nav}>
        {TABS.map(tab => (
          <button
            key={tab}
            style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabActive : {}) }}
            onClick={() => { setActiveTab(tab); setSelectedInstance(null); }}
          >
            {tab}
          </button>
        ))}
        {selectedInstance && (
          <button style={{ ...styles.tabBtn, ...styles.tabActive }}>
            📊 Metrics
          </button>
        )}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'EC2 Instances' && !selectedInstance &&
          <EC2Instances onSelectInstance={handleSelectInstance} />}
        {activeTab === 'S3 Buckets' && <S3Buckets />}
        {selectedInstance && <MetricsChart instanceId={selectedInstance} onBack={handleBack} />}
      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: 'Inter, Segoe UI, sans-serif', background: '#f8fafc', minHeight: '100vh' },
  header: { background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '20px 32px' },
  headerInner: { maxWidth: 1200, margin: '0 auto' },
  logo: { color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: 0.5 },
  subtitle: { color: '#93c5fd', fontSize: 13, marginTop: 4 },
  nav: { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', gap: 4 },
  tabBtn: { background: 'none', border: 'none', padding: '14px 18px', cursor: 'pointer', fontSize: 14, color: '#64748b', fontWeight: 500, borderBottom: '2px solid transparent' },
  tabActive: { color: '#2563eb', borderBottom: '2px solid #2563eb', fontWeight: 700 },
  content: { maxWidth: 1200, margin: '0 auto', padding: 32 },
};
