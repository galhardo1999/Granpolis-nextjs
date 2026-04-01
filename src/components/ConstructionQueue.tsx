"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BUILDINGS, BuildingId } from '@/lib/constants';

interface QueueItem {
  building: BuildingId;
  startTime: number;
  finishTime: number;
  level: number;
}

interface ConstructionQueueProps {
  queue: QueueItem[];
  onCancel: (index: number) => void;
}

export function ConstructionQueue({ queue, onCancel }: ConstructionQueueProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="construction-queue-horizontal">
      <div className="queue-label-vertical">OBRAS</div>
      <div className="queue-items-container">
        {queue.map((item, index) => {
          const building = BUILDINGS[item.building];
          const remaining = Math.max(0, Math.ceil((item.finishTime - now) / 1000));
          const totalDuration = item.finishTime - item.startTime;
          const progress = index === 0 ? Math.min(100, Math.max(0, ((now - item.startTime) / totalDuration) * 100)) : 0;

          return (
            <div key={index} className={`q-item ${index === 0 ? 'active' : ''}`}>
              <div className="q-box">
                <Image 
                  src={building.image} 
                  alt={building.name} 
                  width={60} 
                  height={60} 
                  className="q-img"
                />
                <div className="q-level">▲ {item.level}</div>
                <button className="q-cancel" onClick={() => onCancel(index)} title="Cancelar construção">×</button>
              </div>
              
              <div className="q-name">{building.name}</div>
              
              {index === 0 && (
                <div className="q-progress-container">
                  <div className="q-timer">{formatTime(remaining)}</div>
                  <div className="q-bar-bg">
                    <div className="q-bar-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Placeholder slots to fill the bar visually like in the game */}
        {Array.from({ length: Math.max(0, 7 - queue.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="q-item empty">
            <div className="q-box"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
