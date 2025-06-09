import { Hero } from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import { Categories } from '@/components/Categories'
import { About } from '@/components/About'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <About />
    </div>
  );
}
