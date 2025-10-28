
import React from 'react';
import { ChipIcon } from './icons/ChipIcon';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-center sm:justify-start">
      <div className="flex items-center space-x-3">
        <ChipIcon className="w-10 h-10 text-blue-400" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">TradeWise AI</h1>
      </div>
    </header>
  );
};
