import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);
