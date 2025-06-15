export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif text-gray-900 mb-8">Returns & Exchanges</h1>
        
        <div className="prose prose-lg text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">30-Day Return Policy</h2>
            <p>
              We want you to love your ZEVANY jewelry. If you&apos;re not completely satisfied, 
              you can return most items within 30 days of delivery for a full refund or exchange.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Conditions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Items must be in original condition with all tags attached</li>
              <li>Custom and personalized items cannot be returned unless defective</li>
              <li>Earrings cannot be returned for hygiene reasons unless defective</li>
              <li>Items must be returned in original packaging</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Return</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Step 1: Contact Us</h3>
                <p className="text-gray-600">Email us at returns@zevany.com with your order number</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Step 2: Pack Your Items</h3>
                <p className="text-gray-600">Securely package items in original packaging</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Step 3: Ship Back</h3>
                <p className="text-gray-600">Use the prepaid return label we provide</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exchanges</h2>
            <p>
              We&apos;re happy to exchange items for a different size or style. Exchanges are subject 
              to availability and must meet the same conditions as returns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Processing</h2>
            <p>
              Refunds are processed within 5-7 business days after we receive your return. 
              The refund will be credited to your original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quality Guarantee</h2>
            <p>
              All ZEVANY jewelry comes with a lifetime warranty against manufacturing defects. 
              If you experience any issues with craftsmanship, we&apos;ll repair or replace your item free of charge.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
