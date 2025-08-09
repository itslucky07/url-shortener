import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

export default function Admin(){
  const [urls, setUrls] = useState([]);
  useEffect(()=>{
    axios.get(`${API_BASE}/api/admin/urls`).then(r=>setUrls(r.data)).catch(()=>{});
  },[]);
  return (
    <div className="card container">
      <h1>Admin — All URLs</h1>
      <table className="urls">
        <thead>
          <tr><th>Short</th><th>Original</th><th>Visits</th><th>Created</th></tr>
        </thead>
        <tbody>
          {urls.map(u=>(
            <tr key={u._id}>
              <td><a href={`${API_BASE}/${u.shortCode}`} target="_blank" rel="noreferrer">{u.shortCode}</a></td>
              <td className="orig">{u.originalUrl}</td>
              <td className="center">{u.visits}</td>
              <td className="muted">{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
