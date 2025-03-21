'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';

interface SatisfyingButtonProps {
  onClick: () => void;
}

export default function SatisfyingButton({ onClick }: SatisfyingButtonProps) {
  const controls = useAnimation();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = async () => {
    setIsPressed(true);
    await controls.start({
      scale: [1, 0.97, 0.95, 0.97, 1],
      rotateZ: [0, -1, 1, -1, 0],
      transition: {
        duration: 0.18,
        times: [0, 0.2, 0.5, 0.8, 1],
        ease: "easeInOut",
      },
    });
    setIsPressed(false);
    onClick();
  };

  return (
    <motion.button
      className={`
        relative w-[200px] h-[200px] 
        rounded-full 
        shadow-[0_20px_40px_rgba(0,0,0,0.2),inset_0_4px_0_rgba(255,255,255,1),inset_0_-8px_0_rgba(0,0,0,0.1)] 
        hover:shadow-[0_30px_60px_rgba(0,0,0,0.3),inset_0_4px_0_rgba(255,255,255,1),inset_0_-8px_0_rgba(0,0,0,0.1)]
        transition-all duration-200
        overflow-hidden
        focus:outline-none
        active:shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.8),inset_0_-4px_0_rgba(0,0,0,0.1)]
        bg-gradient-to-br from-blue-50 to-white
        border-[12px] border-white
      `}
      animate={controls}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      onClick={handleClick}
      style={{
        background: isPressed
          ? 'linear-gradient(145deg, #e6e7eb, #f0f1f4)'
          : 'linear-gradient(145deg, #f8f9fa, #ffffff)',
      }}
    >
      {/* Outer ring gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/80 via-white/20 to-black/5" />
      
      {/* Inner button face */}
      <div className="absolute inset-[8px] rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-inner" />
      
      {/* Highlight effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-80" 
           style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
      
      {/* Pressed state overlay */}
      <motion.div
        className="absolute inset-0 rounded-full bg-black/5 opacity-0"
        animate={{ opacity: isPressed ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />

      {/* Inner shadow ring */}
      <div className="absolute inset-[2px] rounded-full shadow-[inset_0_8px_16px_rgba(0,0,0,0.1)]" />
    </motion.button>
  );
} 