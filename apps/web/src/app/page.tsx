"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Grid } from "@/components/Common/Grid";
import Hero from "@/components/Landing/Hero";
import Image from "@/components/Landing/Image";
import Features from "@/components/Landing/Features";
import Testimonials from "@/components/Landing/Testimonials";
import Footer from "@/components/Landing/Footer";
import Navbar from "@/components/Landing/Navbar";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const images = [
    { top: "20%", left: "30%", path: "/images/woman.jpg" },
    { top: "27%", right: "25%", path: "/images/woman2.jpg" },
    { bottom: "25%", left: "15%", path: "/images/man.jpg" },
    { bottom: "30%", right: "15%", path: "/images/man2.jpg" },
  ];

  // Motion values for cursor offset
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for gentle movement - increased stiffness and damping for snappier response
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  // Update mouse coordinates with throttling
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Reduced division for more responsive movement
    mouseX.set((e.clientX - centerX) / 50);
    mouseY.set((e.clientY - centerY) / 50);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <>
      {/* Grid background */}
      <div>
        <Grid cellSize={60} />
      </div>

      <div>
        <Navbar/>
      </div>

      {/* Hero section */}
      <div
        ref={containerRef}
        className="relative flex flex-col justify-center items-center h-screen overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ willChange: 'auto' }} // Optimize for animations
      >
        <Hero />

        {/* Floating Images */}
        {images.map((img, i) => {
         
          const multiplier = (i + 1) * 0.8; // Reduced multiplier for subtler layering
          const imageX = useTransform(springX, (value) => value * multiplier);
          const imageY = useTransform(springY, (value) => value * multiplier);

          return (
            <motion.div
              key={i}
              className="absolute hidden md:block"
              style={{
                top: img.top,
                left: img.left,
                right: img.right,
                bottom: img.bottom,
                x: imageX,
                y: imageY,
                willChange: 'transform', // Optimize for animations
              }}
              // Simplified entrance - much lighter
              initial={{ 
                opacity: 0, 
                scale: 0.8,
                y: 20 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0 
              }}
              transition={{ 
                duration: 0.5, 
                delay: 1.8 + (i * 0.15),
                ease: "easeOut"
              }}
              // Lightweight hover
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Image path={img.path} />
            </motion.div>
          );
        })}
      </div>

      <div>
        <Features/>
      </div>

      <div className="mt-20">
        <Footer/>
      </div>
    </>
  );
}