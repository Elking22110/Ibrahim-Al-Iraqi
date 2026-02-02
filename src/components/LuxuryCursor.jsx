import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const LuxuryCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHovering, setIsHovering] = useState(false);

    // Smooth spring physics for the ring
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('.cursor-pointer')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            {/* Main Ring - Physics based */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-[#D4AF37] rounded-full pointer-events-none z-[100] hidden md:block mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    borderColor: isHovering ? "#ffffff" : "#D4AF37",
                    backgroundColor: isHovering ? "rgba(255,255,255,0.1)" : "transparent"
                }}
                transition={{ duration: 0.2 }}
            />

            {/* Center Dot - Direct tracking (No lag) */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-[#D4AF37] rounded-full pointer-events-none z-[100] hidden md:block"
                style={{
                    x: useMotionValue(0), // Will be updated via effect if we want direct tracking, but let's just use the same motion value with an offset or simpler:
                    // Actually, let's keep it simple. The dot usually follows directly.
                    // We can reuse the motion values but maybe without spring for the dot if we want it "snappy", 
                    // or just let it follow the spring too for cohesion.
                    // The original code had the dot following directly. Let's do that.
                    x: cursorX,
                    y: cursorY,
                    translateX: 12, // Offset to center within the 32px ring (16px center - 4px dot center = 12px? No, math: Ring top-left is at mouse-16. Dot top-left is at mouse-4. So Dot is Ring + 12.)
                    translateY: 12
                }}
            />
        </>
    );
};

export default LuxuryCursor;
