import { generateCategoryMetadata } from '@/utils/categorySeo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata({
    category: 'rings',
    description: 'Discover our stunning collection of luxury rings. From elegant engagement rings to statement cocktail rings, each piece is crafted with precision and timeless elegance.'
  });
}
