import CategoryProductGrid from './CategoryProductGrid';
import { getAllProducts } from '@/utils/db/productsDb';
import { Product } from '@/types/Product';

export const revalidate = 120; // Revalidate every 2 minutes

export default async function Necklaces() {
  try {
    // Fetch all products on the server
    const allProducts = await getAllProducts();
    // Filter for necklaces category
    const necklaceProducts = allProducts.filter(p => p.category?.toLowerCase() === 'necklaces');

    // At this point, all products should have the details property due to our updates
    // to the getAllProducts function

    return (
      <div className="min-h-screen bg-[#f5f3ea]">
        <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
              Necklaces
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-montserrat)" }}>
              Stunning necklaces that complement your style. From delicate pendants to bold statement pieces.
            </p>
          </div>

          {/* Product Grid */}
          <CategoryProductGrid products={necklaceProducts} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading necklace products:", error);
    return (
      <div className="min-h-screen bg-[#f5f3ea] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Temporarily Unavailable</h2>
          <p className="text-gray-600">Our necklace collection is currently being updated. Please check back soon.</p>
        </div>
      </div>
    );
  }
}
