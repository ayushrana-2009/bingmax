'use client';
import React from 'react';

export default function SeasonSelector({ seasons, selectedSeason, onSelectSeason }) {
  return (
    <div style={{ display: 'flex', overflowX: 'auto', padding: '10px', paddingBottom: '20px' }}>
      {seasons.map((item) => (
        <button
        key={item.id}
        onClick={() => onSelectSeason(item)}
        style={{
          padding: '10px 20px',
          marginRight: '10px',
          borderRadius: '5px',
          border: selectedSeason.id === item.id ? '2px solid blue' : '2px solid #007bff',
          backgroundColor: selectedSeason.id === item.id ? 'red' : 'blue',
          color: 'white',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'purple';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = selectedSeason.id === item.id ? 'red' : 'blue';
        }}
      >
        {item.tit}
      </button>
      
      ))}
    </div>
  );
}
