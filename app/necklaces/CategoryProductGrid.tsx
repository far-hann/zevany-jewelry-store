"use client";

import { Product } from '@/types/Product';

interface NecklacesCategoryProps {
  products: Product[];
}

export default function NecklacesCategory({ products }: NecklacesCategoryProps) {
  return (
    <div>
      {/* Render your products here */}
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <span>{product.price}</span>
        </div>
      ))}
    </div>
  );
}
