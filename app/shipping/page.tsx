export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif text-gray-900 mb-8">Shipping Information</h1>
        
        <div className="prose prose-lg text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Free Shipping</h2>
            <p>
              Enjoy complimentary standard shipping on all orders over $100. For orders under $100, 
              standard shipping is $9.95 within the continental United States.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Options</h2>
            <div className="grid gap-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Standard Shipping (5-7 business days)</h3>
                <p className="text-gray-600">Free on orders over $100, otherwise $9.95</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Express Shipping (2-3 business days)</h3>
                <p className="text-gray-600">$19.95</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Overnight Shipping (1 business day)</h3>
                <p className="text-gray-600">$39.95</p>
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

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Shipping</h2>
            <p>
              We ship worldwide with delivery times varying by destination. International 
              customers are responsible for any customs duties and taxes.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
