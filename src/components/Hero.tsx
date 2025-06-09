'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useViewportScroll } from 'framer-motion'
import Image from 'next/image'

export function Hero() {
  const controls = useAnimation();
  const { scrollY } = useViewportScroll();
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return scrollY.onChange((y) => {
      // Animate logo up and fade out as user scrolls
      controls.start({
        y: -y * 0.6,
        opacity: Math.max(1 - y / 300, 0)
      });
    });
  }, [controls, scrollY]);
  return (
    <div className="relative min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white px-4">
      <motion.div
        ref={logoRef}
        initial={{ opacity: 0, y: 40 }}
        animate={controls}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="z-10 flex flex-col items-center justify-center w-full"
      >
        <Image
          src="/images/brand/zevany-logo.svg"
          alt="Zevany Logo"
          width={400}
          height={200}
          className="w-[240px] sm:w-[320px] md:w-[380px] lg:w-[400px] h-auto mx-auto select-none"
          draggable={false}
          priority
        />
      </motion.div>
    </div>
  );
}
