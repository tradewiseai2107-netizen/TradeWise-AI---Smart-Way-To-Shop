
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeScreen } from './components/WelcomeScreen';
import type { Product } from './types';
import { fetchProductSuggestions, generateProductImage, findBuyingOptions } from './services/geminiService';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialState, setIsInitialState] = useState<boolean>(true);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a description of the electronic you're looking for.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProducts([]);
    setIsInitialState(false);

    try {
      const suggestedProducts = await fetchProductSuggestions(query);
      setProducts(suggestedProducts.map(p => ({ ...p, imageUrl: '' }))); // Set products without images or options first

      // Generate images and find options asynchronously
      suggestedProducts.forEach(async (product, index) => {
        const [imageUrlResult, buyingOptionsResult] = await Promise.allSettled([
          generateProductImage(product.name),
          findBuyingOptions(product.name),
        ]);

        setProducts(prevProducts => {
          const newProducts = [...prevProducts];
          if (newProducts[index]) {
            const updatedProduct = { ...newProducts[index] };
            
            if (imageUrlResult.status === 'fulfilled') {
              updatedProduct.imageUrl = imageUrlResult.value;
            } else {
              console.error(`Failed to generate image for ${product.name}:`, imageUrlResult.reason);
            }

            if (buyingOptionsResult.status === 'fulfilled') {
              updatedProduct.buyingOptions = buyingOptionsResult.value;
            } else {
              console.error(`Failed to find buying options for ${product.name}:`, buyingOptionsResult.reason);
              updatedProduct.buyingOptions = []; // Set to empty to indicate fetch is done (with error)
            }
            newProducts[index] = updatedProduct;
          }
          return newProducts;
        });
      });
    } catch (err) {
      console.error(err);
      setError('Sorry, we hit a snag trying to find your gadget. Please try a different search.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center mt-12">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-gray-400">Our AI is scanning the market for you...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-center mt-12 text-red-400 text-lg">{error}</p>;
    }
    if (isInitialState) {
        return <WelcomeScreen />;
    }
    if (products.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {products.map((product, index) => (
            <ProductCard key={`${product.name}-${index}`} product={product} />
          ))}
        </div>
      );
    }
    if (!isInitialState) {
        return <p className="text-center mt-12 text-gray-400 text-lg">No products found for your query. Try being more specific or general.</p>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Find Your Perfect Electronic Companion
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-center text-gray-400">
            Describe what you need, and our AI will find the best gadgets for you.
            Try "A powerful laptop for video editing under ₹1,20,000" or "a durable waterproof camera for hiking".
          </p>
          <SearchBar
            query={query}
            setQuery={setQuery}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
          <div className="mt-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
