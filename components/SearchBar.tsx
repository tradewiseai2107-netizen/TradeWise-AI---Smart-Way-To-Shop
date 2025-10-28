
import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, handleSubmit, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
      <div className="flex items-center bg-gray-800 border border-gray-700 rounded-full shadow-lg overflow-hidden p-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., A lightweight laptop for a college student..."
          className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 px-4 py-2 text-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-semibold rounded-full px-6 py-3 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <SearchIcon className="w-6 h-6 mr-2" />
          )}
          <span>{isLoading ? 'Searching...' : 'Find'}</span>
        </button>
      </div>
    </form>
  );
};
