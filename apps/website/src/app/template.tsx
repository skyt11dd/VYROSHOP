'use client';

import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in" style={{ animationDuration: '0.4s' }}>
      {children}
    </div>
  );
}
