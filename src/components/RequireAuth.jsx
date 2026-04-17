import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const readJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
};

const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const isJwtExpired = (token) => {
  if (!token || typeof token !== 'string') return true;
  const parts = token.split('.');
  if (parts.length !== 3) return true;

  try {
    const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);

    // If token has no exp, treat as non-expiring (fallback to existence check).
    if (payload?.exp === undefined || payload?.exp === null) return false;

    const nowSec = Math.floor(Date.now() / 1000);
    return Number(payload.exp) <= nowSec;
  } catch {
    return true;
  }
};

export default function RequireAuth({ children }) {
  const location = useLocation();

  const token = localStorage.getItem('token');
  const user = readJson('user');

  if (!token || isJwtExpired(token)) {
    clearAuth();
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  // Optional: if user status is deactivated, still allow navigation
  // because the app uses a special dashboard route for deactivated users.
  // (Backend should enforce real access control.)
  void user;

  return <>{children}</>;
}
