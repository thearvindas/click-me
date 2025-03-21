'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [count, setCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Create audio context and buffer outside of render
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let audioBuffer: AudioBuffer | null = null;

    const initAudio = async () => {
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const response = await fetch('/click.mp3');
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      } catch (error) {
        console.error('Audio initialization failed:', error);
      }
    };

    initAudio();
    setIsLoaded(true);

    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const playSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.5; // 50% volume
      
      fetch('/click.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          source.buffer = audioBuffer;
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
          source.start(0);
        })
        .catch(error => console.error('Error playing sound:', error));
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 15;
    const y = (e.clientY - rect.top - rect.height / 2) / 15;
    setMousePosition({ x, y });
  };

  const handleClick = () => {
    setCount(prev => prev + 1);
    setIsPressed(true);

    // Play click sound
    playSound();

    // Trigger haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([5, 10, 5]);
    }

    // Clear previous message first
    setMessage(null);

    // Show new milestone message if applicable
    if (count === 9) {
      setMessage('Double digits! 🎉');
    } else if (count === 49) {
      setMessage('Halfway to 100! 🚀');
    } else if (count === 99) {
      setMessage('Almost there! 💪');
    } else if (count === 100) {
      setMessage('Century! 🏆');
    }

    setTimeout(() => {
      setIsPressed(false);
    }, 80);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8"
         style={{ 
           perspective: '1500px',
           opacity: isLoaded ? 1 : 0,
           transition: 'opacity 0.3s ease',
           position: 'relative'
         }}>
      <div 
        style={{ 
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(20deg) scale(1.2)',
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: count > 0 ? '2rem' : '4rem' // Offset the space that will be taken by counter
        }}>
        {/* Ambient glow effect */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '400px',
          height: '400px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(100,200,255,0.2), transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          opacity: isPressed ? '1' : '0.6',
          transition: 'opacity 0.15s ease'
        }} />

        <motion.button
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
          animate={{
            scale: isPressed ? 0.9 : 1,
            rotateX: mousePosition.y,
            rotateY: -mousePosition.x,
            transition: {
              type: "spring",
              stiffness: 600,
              damping: 12,
              mass: 0.6,
              duration: 0.08
            }
          }}
          style={{
            position: 'relative',
            width: '180px',
            height: '180px',
            backgroundColor: 'transparent',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(90px)',
            outline: 'none'
          }}
        >
          {/* Deep shadow for depth */}
          <div style={{
            position: 'absolute',
            inset: '-30px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.4), transparent 70%)',
            transform: 'translateZ(-92px)',
            filter: 'blur(20px)',
            opacity: 0.8
          }} />

          {/* Button base with metallic effect */}
          <div style={{
            position: 'absolute',
            inset: '0',
            borderRadius: '50%',
            background: `
              linear-gradient(
                135deg,
                #2a2a2a 0%,
                #3a3a3a 20%,
                #4a4a4a 30%,
                #5a5a5a 40%,
                #6a6a6a 50%,
                #5a5a5a 60%,
                #4a4a4a 70%,
                #3a3a3a 80%,
                #2a2a2a 100%
              )
            `,
            transform: 'translateZ(-1px)',
            boxShadow: isPressed
              ? `
                0 1px 2px rgba(0,0,0,0.3),
                inset 0 1px 5px rgba(0,0,0,0.5),
                0 0 0 1px rgba(255,255,255,0.1)
              `
              : `
                0 15px 35px rgba(0,0,0,0.4),
                0 5px 15px rgba(0,0,0,0.3),
                inset 0 -8px 16px rgba(0,0,0,0.4),
                0 0 0 1px rgba(255,255,255,0.1)
              `,
            transition: 'all 0.12s ease'
          }} />

          {/* Metallic rim */}
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4a4a4a, #2a2a2a)',
            transform: 'translateZ(-2px)',
            opacity: 0.8
          }} />

          {/* Top surface with brushed metal effect */}
          <div style={{
            position: 'absolute',
            inset: '4px',
            borderRadius: '50%',
            background: `
              linear-gradient(135deg, #666 0%, #444 100%),
              repeating-linear-gradient(
                45deg,
                rgba(255,255,255,0.05),
                rgba(255,255,255,0.05) 1px,
                transparent 1px,
                transparent 2px
              )
            `,
            transform: 'translateZ(2px)',
            boxShadow: isPressed
              ? 'inset 0 1px 3px rgba(0,0,0,0.5)'
              : 'inset 0 -2px 5px rgba(0,0,0,0.5)',
            transition: 'all 0.12s ease'
          }} />

          {/* Highlight ring */}
          <div style={{
            position: 'absolute',
            inset: '0',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
            transform: 'translateZ(3px)',
            opacity: isPressed ? 0.2 : 0.6,
            transition: 'opacity 0.12s ease'
          }} />

          {/* Click ripple effect */}
          <AnimatePresence>
            {isPressed && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  inset: '-50%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                  transform: 'translateZ(4px)',
                  pointerEvents: 'none',
                  zIndex: 5
                }}
              />
            )}
          </AnimatePresence>

          {/* Text container with better integration */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translateZ(5px)',
            zIndex: 10,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
            borderRadius: '50%',
            overflow: 'hidden'
          }}>
            <span style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '16px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textShadow: `
                0 1px 1px rgba(0,0,0,0.6),
                0 0 2px rgba(0,0,0,0.3)
              `,
              opacity: isPressed ? 0.7 : 0.9,
              transition: 'all 0.08s ease',
              userSelect: 'none',
              transform: `scale(${isPressed ? 0.92 : 1})`,
              mixBlendMode: 'overlay'
            }}>
              {isMobile ? 'Press Me' : 'Click Me'}
            </span>
          </div>
        </motion.button>
      </div>

      <AnimatePresence mode="popLayout">
        {count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: 'relative',
              textAlign: 'center',
              padding: '1.4rem 2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              boxShadow: `
                0 8px 20px rgba(0,0,0,0.3),
                inset 0 0 0 1px rgba(255,255,255,0.1)
              `,
              transform: 'translateZ(0)',
              minWidth: '180px'
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <span style={{ 
                  fontSize: '36px',
                  fontWeight: '600',
                  color: '#fff',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {count} {count === 1 ? 'click' : 'clicks'}
                </span>
                <span style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: '450',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em'
                }}>
                  {isMobile ? "you've pressed" : "you've clicked"} this button{' '}
                  {count > 1 && (
                    <motion.span
                      key={count}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 10
                        }
                      }}
                      style={{
                        color: '#64c8ff',
                        textShadow: '0 0 8px rgba(100,200,255,0.5)',
                        display: 'inline-block',
                        margin: '0 0.1em'
                      }}
                    >
                      again
                    </motion.span>
                  )}{' '}
                  for no reason
                </span>
              </div>
            </div>
            
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  enter: { duration: 0.3 },
                  exit: { duration: 0.5 }
                }}
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.9)',
                  marginTop: '1.2rem',
                  fontWeight: '500',
                  letterSpacing: '0.05em',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Credits */}
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '12px',
        fontWeight: '400',
        letterSpacing: '0.05em',
        textAlign: 'center',
        width: '100%',
        padding: '0 1rem'
      }}>
        Built by <a 
          href="mailto:thearvindas@gmail.com" 
          style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.2s ease',
            padding: '0 1px'
          }}
          onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid rgba(255, 255, 255, 0.6)'}
          onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)'}
        >
          Arvin
        </a> with Next.js, TypeScript, Tailwind CSS, Framer Motion, Cursor{' '}
        <span style={{ opacity: 0.5 }}>•</span>{' '}
        with help from Claude
      </div>
    </div>
  );
} 