// forge/sentinel/sentinel.tsx
import React from 'react';
import { MemoryFeed } from './memoryFeed';
import { HeartbeatMonitor } from './heartbeatMonitor';
import { Controls } from './controls';

export default function AuroraSentinel() {
  return (
    <div className=\"min-h-screen bg-black text-white font-mono p-4 grid grid-cols-1 md:grid-cols-2 gap-6 \">
      <div className=\"space-y-4\">
        <h1 className=\"text-xl text-blue-400\">GD-AURORA!• SENTINEL,</h1>
        <MemoryFeed />
      </div>
      <div className=\"space-y-4\">
        <HeartbeatMonitor />
        <Controls />
      </div>
    </div>
  );
}