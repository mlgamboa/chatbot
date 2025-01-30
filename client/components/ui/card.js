import React from 'react';

export const Card = ({ className = '', children }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ className = '', children }) => (
  <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children }) => (
  <h3 className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ className = '', children }) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ className = '', children }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);