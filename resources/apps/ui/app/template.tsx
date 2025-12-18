"use client";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: { opacity: 0, y: -15 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 15 },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
