import CategoryProductGrid from './CategoryProductGrid';
import { getAllProducts } from '@/utils/db/productsDb';
import { Product } from '@/types/Product';

export const revalidate = 120; // Revalidate every 2 minutes

export default async function Earrings() {
  try {
    // Fetch all products on the server
    const allProducts = await getAllProducts();
    // Filter for earrings category
    const earringProducts = allProducts.filter(p => p.category?.toLowerCase() === 'earrings');

    // At this point, all products should have the details property due to our updates
    // to the getAllProducts function

    return (
      <div className="min-h-screen bg-[#f5f3ea]">
        <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
              Earrings
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-montserrat)" }}>
              Exquisite earrings that frame your face beautifully. From subtle studs to dramatic chandeliers.
            </p>
          </div>

          {/* Product Grid */}
          <CategoryProductGrid products={earringProducts} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading earring products:", error);
    return (
      <div className="min-h-screen bg-[#f5f3ea] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Temporarily Unavailable</h2>
          <p className="text-gray-600">Our earring collection is currently being updated. Please check back soon.</p>
        </div>
      </div>
    );
  }
}
