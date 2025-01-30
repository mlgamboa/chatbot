import React, { useState } from 'react';

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList = ({ activeTab, setActiveTab, children }) => (
  <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
    {React.Children.map(children, (child) =>
      React.cloneElement(child, {
        isActive: child.props.value === activeTab,
        onClick: () => setActiveTab(child.props.value),
      })
    )}
  </div>
);

export const TabsTrigger = ({ value, isActive, onClick, children }) => (
  <button
    className={`px-4 py-2 text-sm font-medium ${
      isActive
        ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, activeTab, children }) => (
  <div className={`mt-4 ${value === activeTab ? 'block' : 'hidden'}`}>
    {children}
  </div>
);