import React from 'react';
import type { Product } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface ProductCardProps {
  product: Product;
}

const ImagePlaceholder: React.FC = () => (
    <div className="w-full h-56 bg-gray-700 animate-pulse flex items-center justify-center rounded-t-lg">
        <svg className="w-10 h-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    </div>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
      ) : (
        <ImagePlaceholder />
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white leading-tight pr-4">{product.name}</h3>
            <span className="text-xl font-extrabold text-teal-300 whitespace-nowrap">{product.estimated_price}</span>
        </div>
        <p className="text-sm font-medium text-blue-400 mt-1">{product.category}</p>
        
        <p className="text-gray-400 mt-4 text-sm flex-grow">
            <span className="font-semibold text-gray-300">Why it's a great fit: </span>{product.reasoning}
        </p>

        <div className="mt-6">
            <h4 className="font-semibold text-gray-200">Key Specs:</h4>
            <ul className="mt-2 space-y-2">
                {product.key_specs.map((spec, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-400">
                        <CheckCircleIcon className="w-5 h-5 text-teal-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{spec}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="mt-auto pt-6">
          {product.buyingOptions === undefined && (
            <div className="text-center text-gray-400">
              <svg className="animate-spin mx-auto h-6 w-6 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm">Searching for retailers...</p>
            </div>
          )}

          {product.buyingOptions && product.buyingOptions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-200">Buying Options:</h4>
              <ul className="mt-2 space-y-2">
                {product.buyingOptions.map((option, index) => (
                  <li key={index}>
                    <a
                      href={option.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                      <ExternalLinkIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate" title={option.title}>{option.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.buyingOptions?.length === 0 && (
            <p className="text-center text-gray-500 text-sm">No online buying options found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
