import React, { useState } from 'react';

export const Switch = ({ checked, onChange }) => {
  return (
    <div
      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </div>
  );
};