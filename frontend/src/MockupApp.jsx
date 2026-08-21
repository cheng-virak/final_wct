import React, { useState } from 'react';

export default function MockupApp() {
  const [staticMessage, setStaticMessage] = useState('System Mockup Status: Idle');

  return (
    <div style={{ fontFamily: 'Courier, sans-serif', backgroundColor: '#e2e8f0', minHeight: '100vh', padding: '20px' }}>
      {/* Header Bar */}
      <div style={{ background: '#1e293b', color: '#f8fafc', padding: '15px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', margin: 0 }}>Grand Horizon - Static Visual Mockup</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setStaticMessage('Language toggle clicked (Static)')} style={{ padding: '5px 15px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>
            EN / ខ្មែរ
          </button>
          <button onClick={() => setStaticMessage('Hotline clicked (Static)')} style={{ padding: '5px 15px', background: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}>
            Concierge Call
          </button>
        </div>
      </div>

      {/* Floating Status Notification */}
      <div style={{ margin: '15px 0', padding: '10px', background: '#fef08a', border: '2px dashed #ca8a04', color: '#854d0e', fontWeight: 'bold' }}>
        ℹ️ {staticMessage}
      </div>

      {/* Disorganized Grid / Overlapping Mockup Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* Card 1: Hardcoded Room Hold */}
        <div style={{ background: '#ffffff', padding: '20px', border: '3px solid #6366f1', transform: 'rotate(-1deg)', boxShadow: '5px 5px 0px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontFamily: 'Arial, sans-serif', color: '#4338ca', fontSize: '18px' }}>Deluxe Ocean Suite</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Capacity: 2 Guests · 750 sq.ft</p>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#059669', margin: '10px 0' }}>$280 / night</div>
          <div style={{ background: '#fde047', padding: '5px', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' }}>
            ⏳ 48-Hour Free Room Hold Active (Hardcoded)
          </div>
          <button 
            onClick={() => setStaticMessage('Hold Room button clicked (Static Mockup)')}
            style={{ width: '100%', padding: '10px', background: '#f59e0b', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Hold Room (Static)
          </button>
        </div>

        {/* Card 2: Hardcoded Admin Revenue Widget */}
        <div style={{ background: '#0f172a', color: '#ffffff', padding: '20px', border: '2px solid #38bdf8', transform: 'rotate(1deg)', boxShadow: '-5px 5px 0px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '16px', color: '#38bdf8' }}>Admin Occupancy & Revenue</h2>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4ade80', margin: '10px 0' }}>$4,560.00</div>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>Confirmed Revenue: 8 Rooms Locked</p>
          <div style={{ height: '60px', background: '#1e293b', border: '1px dotted #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#cbd5e1', marginTop: '10px' }}>
            [ Static Chart Visual Placeholder ]
          </div>
          <button 
            onClick={() => setStaticMessage('Sync Revenue clicked (Static Mockup)')}
            style={{ marginTop: '10px', width: '100%', padding: '8px', background: '#8b5cf6', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Sync Data
          </button>
        </div>

        {/* Card 3: Hardcoded Booking Form */}
        <div style={{ background: '#ffffff', padding: '20px', border: '2px solid #ef4444', boxShadow: '5px -5px 0px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '18px', color: '#b91c1c' }}>Guest Stay Reservation Form</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Guest Name:</label>
            <input type="text" defaultValue="Alexander Morgan" style={{ padding: '6px', border: '1px solid #cbd5e1' }} />
            
            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Check-in Date:</label>
            <input type="date" defaultValue="2026-08-25" style={{ padding: '6px', border: '1px solid #cbd5e1' }} />

            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Check-out Date:</label>
            <input type="date" defaultValue="2026-08-28" style={{ padding: '6px', border: '1px solid #cbd5e1' }} />

            <button 
              onClick={() => setStaticMessage('Filter Dates clicked (Static Mockup)')}
              style={{ marginTop: '10px', padding: '10px', background: '#2563eb', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Filter Dates
            </button>
          </div>
        </div>

        {/* Card 4: Hardcoded Notifications & Holds Queue */}
        <div style={{ background: '#ffffff', padding: '20px', border: '2px dashed #10b981', boxShadow: '-5px -5px 0px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '18px', color: '#047857' }}>Front Desk Notification Feed</h2>
          <ul style={{ fontSize: '11px', paddingLeft: '20px', marginTop: '10px', lineHeight: '1.8' }}>
            <li>✓ Reservation #101 Confirmed (Deluxe Ocean Suite)</li>
            <li>⏳ Reservation #102 Hold Active (Pool Villa - 42h left)</li>
            <li>✕ Reservation #103 Released by Admin</li>
          </ul>
          <button 
            onClick={() => setStaticMessage('Mark Read clicked (Static Mockup)')}
            style={{ width: '100%', padding: '8px', background: '#475569', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}
          >
            Mark All Read
          </button>
        </div>

      </div>

      {/* Return to Live App Link */}
      <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px' }}>
        <a href="/" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'underline', marginRight: '20px' }}>
          ← Return to Live Functional Guest Portal
        </a>
        <a href="/admin.html" style={{ color: '#7c3aed', fontWeight: 'bold', textDecoration: 'underline' }}>
          Open Live Front Desk Admin Portal →
        </a>
      </div>
    </div>
  );
}
