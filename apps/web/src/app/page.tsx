"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Grid } from "@/components/Common/Grid";
import Hero from "@/components/Landing/Hero";
import ImageRenderer from "@/components/Landing/ImageRenderer";
import Features from "@/components/Landing/Features";
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

  // Smooth spring for gentle movement
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  // ✅ Fixed: Create transforms at the top level for each image
  const transform1X = useTransform(springX, (value) => value * 0.8);
  const transform1Y = useTransform(springY, (value) => value * 0.8);
  const transform2X = useTransform(springX, (value) => value * 1.6);
  const transform2Y = useTransform(springY, (value) => value * 1.6);
  const transform3X = useTransform(springX, (value) => value * 2.4);
  const transform3Y = useTransform(springY, (value) => value * 2.4);
  const transform4X = useTransform(springX, (value) => value * 3.2);
  const transform4Y = useTransform(springY, (value) => value * 3.2);

  // Array of transforms for easy access
  const transforms = [
    { x: transform1X, y: transform1Y },
    { x: transform2X, y: transform2Y },
    { x: transform3X, y: transform3Y },
    { x: transform4X, y: transform4Y },
  ];

  // Mouse handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

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
        <Navbar />
      </div>

      {/* Hero section */}
      <div
        ref={containerRef}
        className="relative flex flex-col justify-center items-center h-screen overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ willChange: "auto" }}
      >
        <Hero />

        {/* Floating Images */}
        {images.map((img, i) => (
          <motion.div
            key={i}
            className="absolute hidden md:block"
            style={{
              top: img.top,
              left: img.left,
              right: img.right,
              bottom: img.bottom,
              x: transforms[i].x,
              y: transforms[i].y,
              willChange: "transform",
            }}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 1.8 + i * 0.15,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
          >
            <ImageRenderer path={img.path} />
          </motion.div>
        ))}
      </div>

      <div>
        <Features />
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </>
  );
}