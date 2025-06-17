import MobilePageWrapper from '@/components/MobilePageWrapper'

export default function ShippingPage() {
  return (
    <MobilePageWrapper title="Shipping" showBackButton={true}>
      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-8 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-8 hidden lg:block">Shipping Information</h1>
        
        <div className="prose prose-lg text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Free Shipping</h2>
            <p>
              Enjoy complimentary standard shipping on all orders over $100. For orders under $100, 
              standard shipping is $9.95 within the continental United States.
            </p>
          </section>          <section>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4">Shipping Options</h2>
            <div className="space-y-3 lg:space-y-4">
              <div className="border border-gray-200 p-4 lg:p-6 rounded-2xl bg-white shadow-sm">
                <h3 className="font-semibold text-gray-900 text-lg">Standard Shipping</h3>
                <p className="text-gray-600 text-sm mt-1">5-7 business days</p>
                <p className="text-amber-600 font-medium mt-2">Free on orders over $100, otherwise $9.95</p>
              </div>
              <div className="border border-gray-200 p-4 lg:p-6 rounded-2xl bg-white shadow-sm">
                <h3 className="font-semibold text-gray-900 text-lg">Express Shipping</h3>
                <p className="text-gray-600 text-sm mt-1">2-3 business days</p>
                <p className="text-amber-600 font-medium mt-2">$19.95</p>
              </div>
              <div className="border border-gray-200 p-4 lg:p-6 rounded-2xl bg-white shadow-sm">
                <h3 className="font-semibold text-gray-900 text-lg">Overnight Shipping</h3>
                <p className="text-gray-600 text-sm mt-1">1 business day</p>
                <p className="text-amber-600 font-medium mt-2">$39.95</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Processing Time</h2>
            <p>
              Orders are processed within 1-2 business days. Custom and personalized items 
              may require additional processing time of 3-5 business days.
            </p>
          </section>

          <section>            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4">International Shipping</h2>
            <p>
              We ship worldwide with delivery times varying by destination. International 
              customers are responsible for any customs duties and taxes.
            </p>
          </section>
        </div>
      </div>
    </MobilePageWrapper>
  )
}
