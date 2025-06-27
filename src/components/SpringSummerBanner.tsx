'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion';

interface SpringSummerBannerProps {
  imagePath: string;
}

export default function SpringSummerBanner({ imagePath }: SpringSummerBannerProps) {
  return (
    <motion.div
      className="col-span-2 row-span-1 block group text-left"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Link href="/necklaces" className="block h-full">
        <div className="bg-white flex flex-col relative overflow-hidden h-full">
          <div className="relative w-full h-full">
            <Image
              src={imagePath}
              alt="Spring-Summer Collection"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute top-0 left-0 p-4 text-white">
              <h3 className="text-2xl md:text-3xl font-light tracking-wider drop-shadow-lg">Spring-Summer 2025</h3>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
