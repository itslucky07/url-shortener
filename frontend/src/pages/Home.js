import React, { useState } from 'react';
import axios from 'axios';
// ✅ Import API_BASE from config.js
import { API_BASE } from '../config';

export default function Home(){
  const [original, setOriginal] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setResult(null);
    setLoading(true);
    try {
      // ✅ Use API_BASE directly
      const res = await axios.post(`${API_BASE}/api/shorten`, { originalUrl: original });
      setResult(res.data);
    } catch (error) {
      setErr(error?.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card container">
      <h1>Shorten a link</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="https://example.com/very/long/url"
          value={original}
          onChange={(e)=>setOriginal(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>
      {err && <div className="error">{err}</div>}
      {result && (
        <div className="result">
          <div className="muted">Short URL</div>
          {/* ✅ Link opens in new tab */}
          <a href={result.shortUrl} target="_blank" rel="noreferrer">{result.shortUrl}</a>
          <div className="muted">Shortcode: <strong>{result.shortCode}</strong></div>
        </div>
      )}
    </div>
  );
}
