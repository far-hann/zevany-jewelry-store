import { Metadata } from 'next';
import Link from 'next/link';
import { generateHowToSchema } from '@/utils/faqSeo';

export const metadata: Metadata = {
  title: 'Jewelry Care Guide | How to Clean & Maintain Your ZEVANY Jewelry',
  description: 'Learn how to properly care for your ZEVANY luxury jewelry. Expert tips on cleaning, storage, and maintenance to keep your pieces beautiful for years.',
  keywords: ['jewelry care', 'clean jewelry', 'jewelry maintenance', 'diamond care', 'gold jewelry care', 'jewelry storage'],
  alternates: {
    canonical: 'https://zevany-store.vercel.app/jewelry-care'
  }
};

const careSteps = [
  "Clean your jewelry regularly with warm soapy water and a soft brush",
  "Rinse thoroughly with clean water and dry with a lint-free cloth", 
  "Store pieces separately in soft pouches or jewelry boxes",
  "Remove jewelry before swimming, showering, or exercising",
  "Have professional cleaning done annually for best results"
];

export default function JewelryCarePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHowToSchema("How to Care for Luxury Jewelry", careSteps))
        }}
      />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-light text-gray-900 mb-4">
              Jewelry Care Guide
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Proper care ensures your ZEVANY jewelry maintains its beauty and lasts for generations.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-serif font-medium text-gray-900 mb-6">General Care Instructions</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Daily Care</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Remove jewelry before sleeping, exercising, or household chores</li>
                  <li>• Apply perfumes, lotions, and cosmetics before putting on jewelry</li>
                  <li>• Wipe pieces with a soft cloth after wearing</li>
                  <li>• Inspect clasps and settings regularly</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Storage Tips</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Store pieces separately to prevent scratching</li>
                  <li>• Use lined jewelry boxes or soft pouches</li>
                  <li>• Keep in a cool, dry place away from sunlight</li>
                  <li>• Hang necklaces to prevent tangling</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-medium text-gray-900 mb-6">Material-Specific Care</h2>
            
            <div className="space-y-8">
              <div className="border-l-4 border-gray-900 pl-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Gold Jewelry</h3>
                <p className="text-gray-700 mb-4">
                  Gold is durable but can be scratched by harder materials. Clean with mild soap and warm water, using a soft brush for intricate designs.
                </p>
                <Link href="/collections?filter=gold" className="text-gray-900 underline hover:no-underline">
                  Shop Gold Collection →
                </Link>
              </div>

              <div className="border-l-4 border-gray-900 pl-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Diamond Jewelry</h3>
                <p className="text-gray-700 mb-4">
                  Diamonds are hard but can chip if struck. Clean with ammonia solution (1 part ammonia to 6 parts water) and dry with lint-free cloth.
                </p>
                <Link href="/collections?filter=diamond" className="text-gray-900 underline hover:no-underline">
                  Shop Diamond Collection →
                </Link>
              </div>

              <div className="border-l-4 border-gray-900 pl-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Silver Jewelry</h3>
                <p className="text-gray-700 mb-4">
                  Silver tarnishes naturally. Use silver polishing cloths or professional silver cleaner. Store in anti-tarnish pouches.
                </p>
                <Link href="/collections?filter=silver" className="text-gray-900 underline hover:no-underline">
                  Shop Silver Collection →
                </Link>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Professional Services</h3>
              <p className="text-gray-700 mb-4">
                For deep cleaning, repairs, or resizing, we recommend professional jewelry services. Our experts can restore your pieces to their original brilliance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/support" className="bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 transition-colors">
                  Contact for Service
                </Link>
                <Link href="/faq" className="border border-gray-900 text-gray-900 px-6 py-2 hover:bg-gray-900 hover:text-white transition-colors">
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
