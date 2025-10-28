
import React from 'react';
import { ChipIcon } from './icons/ChipIcon';

export const WelcomeScreen: React.FC = () => {
    return (
        <div className="text-center mt-12 animate-fade-in-up">
            <div className="inline-block p-6 bg-gray-800 rounded-full">
                <ChipIcon className="w-16 h-16 text-blue-400" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-white">Welcome to TradeWise AI</h3>
            <p className="mt-2 text-lg text-gray-400 max-w-md mx-auto">
                Your personal AI assistant for electronics shopping.
                Just type what you're looking for above to get started!
            </p>
        </div>
    );
};
