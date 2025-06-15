import { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us | ZEVANY Luxury Jewelry',
  description: 'Get in touch with ZEVANY Luxury Jewelry. We\'re here to help with any questions about our premium jewelry collection, orders, or custom designs.',
  keywords: 'contact, customer service, jewelry questions, ZEVANY support, luxury jewelry help',
}

export default function Contact() {
  return <ContactClient />
}
