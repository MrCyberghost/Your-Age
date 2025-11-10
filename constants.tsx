
import React from 'react';

export const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "w-6 h-6"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export const CakeIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className || "w-6 h-6"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15.25V11.25a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 11.25v4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9V6.75m0 0a2.25 2.25 0 012.25 2.25M12 6.75a2.25 2.25 0 00-2.25 2.25M12 6.75v-1.5m0 1.5a2.25 2.25 0 005.478 1.132l.001-.002A2.25 2.25 0 0015 6.75M12 6.75a2.25 2.25 0 01-5.478 1.132l-.001-.002A2.25 2.25 0 019 6.75" />
    </svg>
);

export const ClockIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className || "w-6 h-6"}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
