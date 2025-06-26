"use client";

import ShowcaseProductCard from '@/components/ShowcaseProductCard';
import { Product } from '@/types/Product';

interface CategoryProductGridProps {
  products: Product[];
}

export default function CategoryProductGrid({ products }: CategoryProductGridProps) {
  const parsePrice = (price: string | number): number => {
    if (!price) return 0;
    if (typeof price === 'number') return price;
    return parseFloat(String(price).replace(/[^\d.-]/g, ''));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-min items-stretch">
      {products.map((product) => (
        <ShowcaseProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={parsePrice(product.price)}
          image={product.images?.[0] || product.image || '/images/placeholder.jpg'}
          images={product.images}
          isNew={product.isNew}
          colors={product.colors}
        />
      ))}
    </div>
  );
}
