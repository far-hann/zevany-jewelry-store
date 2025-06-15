"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get("q") || "" : "";
  const [results, setResults] = useState<Array<{
    id: string;
    name: string;
    collection: string;
    price: string;
    images?: string[];
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError("");
    fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setResults(data.data.products || []);
        } else {
          setError(data.message || "No results found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch search results.");
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-serif">Search Results</h1>
          <p className="text-xl text-gray-600 font-serif">Showing results for: <span className="font-semibold">{query}</span></p>
        </div>
        {loading ? (
          <div className="text-center text-lg text-gray-600 font-serif">Searching...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-serif">{error}</div>
        ) : results.length === 0 ? (
          <div className="text-center text-gray-600 font-serif">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map(product => (
              <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block">
                <div className="relative aspect-square">
                  <Image src={product.images?.[0] || "/images/placeholder.png"} alt={product.name} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 font-serif mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 font-serif mb-2">{product.collection}</p>
                  <p className="text-lg font-medium text-gray-900 font-serif">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
    </div>}>
      <SearchContent />
    </Suspense>
  );
}
