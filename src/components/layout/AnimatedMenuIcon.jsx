import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedMenuIcon({ isOpen }) {
  return (
    <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
      {/* Top line */}
      <motion.div
        className="w-6 h-0.5 bg-current"
        animate={isOpen ? {
          rotate: 45,
          y: 8,
        } : {
          rotate: 0,
          y: 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      
      {/* Middle line */}
      <motion.div
        className="w-6 h-0.5 bg-current"
        animate={isOpen ? {
          opacity: 0,
          x: -10,
        } : {
          opacity: 1,
          x: 0,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Bottom line */}
      <motion.div
        className="w-6 h-0.5 bg-current"
        animate={isOpen ? {
          rotate: -45,
          y: -8,
        } : {
          rotate: 0,
          y: 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      
      {/* House shape - appears when open */}
      <motion.div
        className="absolute"
        animate={isOpen ? {
          opacity: 1,
          scale: 1,
        } : {
          opacity: 0,
          scale: 0.5,
        }}
        transition={{ duration: 0.3, delay: isOpen ? 0.2 : 0 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-current">
          <path d="M12 3L4 9v12h16V9l-8-6z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="13" width="6" height="8" fill="currentColor"/>
        </svg>
      </motion.div>
    </div>
  );
}