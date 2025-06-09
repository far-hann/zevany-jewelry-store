"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function AnimatedLogoHero() {
  const ref = useRef<HTMLDivElement>(null);
  // Animate logo scale and position based on scroll
  const { scrollY } = useScroll();
  // Scale from 1.0 to 0.4 as you scroll 0 to 300px
  const scale = useTransform(scrollY, [0, 300], [1, 0.4]);
  // Move logo up as you scroll
  const y = useTransform(scrollY, [0, 300], [0, -120]);
  // Fade out after 350px
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center min-h-[60vh] bg-white select-none">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ scale, y, opacity }}
        className="font-serif text-[clamp(3rem,12vw,8rem)] font-normal text-gray-900 tracking-tight leading-none mb-0"
      >
        ZEVANY
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        style={{ opacity }}
        className="mt-4 text-gray-500 text-lg font-light"
      >
        Luxury Jewelry
      </motion.div>
    </div>
  );
}
