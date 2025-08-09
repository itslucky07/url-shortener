import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App(){
  return (
    <div className="app">
      <nav className="nav">
        <div className="brand">✂️ URL Shortener</div>
        <div>
          <Link to="/">Home</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      
    </div>
  );
}
export default App;
