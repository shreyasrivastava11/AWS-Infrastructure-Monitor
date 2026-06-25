import React, { useEffect, useState } from 'react';
import { fetchBuckets, fetchBucketObjects } from '../services/api';

export default function S3Buckets() {
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [objects, setObjects] = useState([]);
  const [objLoading, setObjLoading] = useState(false);

  useEffect(() => {
    fetchBuckets()
      .then(res => setBuckets(res.data))
      .catch(() => setError('Failed to load S3 buckets.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleBucket = async (name) => {
    if (expanded === name) { setExpanded(null); setObjects([]); return; }
    setExpanded(name);
    setObjLoading(true);
    try {
      const res = await fetchBucketObjects(name);
      setObjects(res.data);
    } catch { setObjects([]); }
    finally { setObjLoading(false); }
  };

  if (loading) return <p style={{ color: '#666' }}>Loading S3 buckets...</p>;
  if (error) return <p style={{ color: '#ef4444' }}>{error}</p>;

  return (
    <div>
      <h2 style={{ color: '#1e3a5f', marginBottom: 16 }}>S3 Buckets ({buckets.length})</h2>
      {buckets.length === 0 && <p style={{ color: '#666' }}>No buckets found.</p>}
      {buckets.map(b => (
        <div key={b.bucketName} style={styles.card}>
          <div style={styles.row}>
            <div>
              <div style={styles.name}>{b.bucketName}</div>
              <div style={styles.meta}>Created: {b.creationDate?.split('T')[0]} &nbsp;|&nbsp; Objects: {b.objectCount}</div>
            </div>
            <button style={styles.btn} onClick={() => toggleBucket(b.bucketName)}>
              {expanded === b.bucketName ? 'Hide Objects' : 'List Objects'}
            </button>
          </div>
          {expanded === b.bucketName && (
            <div style={styles.objectList}>
              {objLoading ? <p>Loading objects...</p> : objects.length === 0
                ? <p style={{ color: '#888' }}>Bucket is empty.</p>
                : objects.map((key, i) => <div key={i} style={styles.objectItem}>📄 {key}</div>)
              }
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, marginBottom: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontWeight: 700, fontSize: 15, color: '#1e3a5f' },
  meta: { fontSize: 13, color: '#666', marginTop: 4 },
  btn: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13 },
  objectList: { marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 10 },
  objectItem: { fontSize: 13, color: '#444', padding: '3px 0' },
};
