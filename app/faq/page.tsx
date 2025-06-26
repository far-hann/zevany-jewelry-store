import { Metadata } from 'next';
import { generateFAQSchema } from '@/utils/faqSeo';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | ZEVANY Luxury Jewelry',
  description: 'Find answers to common questions about ZEVANY luxury jewelry, shipping, returns, sizing, and care instructions.',
  keywords: ['jewelry FAQ', 'ring sizing', 'jewelry care', 'shipping information', 'return policy', 'ZEVANY'],
  alternates: {
    canonical: 'https://zevany-store.vercel.app/faq'
  }
};

const faqs = [
  {
    question: "What materials are used in ZEVANY jewelry?",
    answer: "Our jewelry is crafted from premium materials including 14k and 18k gold, sterling silver, genuine diamonds, and precious gemstones. Each piece undergoes rigorous quality testing to ensure durability and lasting beauty."
  },
  {
    question: "How do I determine my ring size?",
    answer: "We recommend visiting a local jeweler for professional sizing. Alternatively, you can use our printable ring sizer guide or measure an existing ring's inner diameter. Our customer service team can also assist with sizing questions."
  },
  {
    question: "What is your return and exchange policy?",
    answer: "We offer a 30-day return policy for unworn items in original condition. Custom and personalized jewelry cannot be returned unless defective. Returns must include original packaging and documentation."
  },
  {
    question: "How should I care for my ZEVANY jewelry?",
    answer: "Store jewelry in individual pouches or compartments to prevent scratching. Clean with a soft cloth and mild soap solution. Avoid exposure to chemicals, perfumes, and harsh cleaners. Professional cleaning is recommended annually."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship worldwide. International orders may be subject to customs duties and taxes determined by your country's regulations. Delivery times vary by destination, typically 7-14 business days."
  },
  {
    question: "Are your diamonds ethically sourced?",
    answer: "Yes, all our diamonds are ethically sourced and conflict-free. We work only with certified suppliers who adhere to the Kimberley Process and maintain strict ethical standards in diamond procurement."
  },
  {
    question: "Do you offer custom jewelry design?",
    answer: "Yes, we offer custom design services for special occasions. Our designers work with you to create unique pieces tailored to your preferences. Custom orders typically take 4-6 weeks to complete."
  },
  {
    question: "What warranty do you provide?",
    answer: "All ZEVANY jewelry comes with a 1-year warranty against manufacturing defects. This covers structural issues but not damage from normal wear, accidents, or improper care."
  }
];

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(faqs))
        }}
      />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-light text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find answers to common questions about our luxury jewelry, policies, and services.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  {faq.question}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              Still have questions? We&apos;re here to help.
            </p>
            <a
              href="/support"
              className="inline-block bg-gray-900 text-white px-8 py-3 hover:bg-gray-800 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
