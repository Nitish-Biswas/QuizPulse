"use client";

import { motion } from "framer-motion";

/**
 * PageTransition
 * Wraps page content with a simple enter/exit animation
 * to provide smooth visual transitions between routes.
 *
 * Uses Framer Motion for:
 * - Fade-in on mount
 * - Slight vertical slide for spatial continuity
 * - Fade-out on unmount (route change)
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      // Initial state when component mounts
      initial={{ opacity: 0, y: 20 }}

      // Animate to visible state
      animate={{ opacity: 1, y: 0 }}

      // Exit animation on route change
      exit={{ opacity: 0, y: -20 }}

      // Transition timing configuration
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
