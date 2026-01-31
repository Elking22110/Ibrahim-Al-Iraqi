import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ThreeDTiltCard = ({ children, className }) => {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Stronger Spring physics for "heavier" luxury feel
    const xSpring = useSpring(x, { stiffness: 400, damping: 20 });
    const ySpring = useSpring(y, { stiffness: 400, damping: 20 });

    // Increased rotation range for dramatic effect
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["20deg", "-20deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

    // Dynamic Glare / Sheen Effect based on mouse position
    const glareX = useTransform(xSpring, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(ySpring, [-0.5, 0.5], ["0%", "100%"]);
    const sheenOpacity = useTransform(ySpring, [-0.5, 0.5], [0, 0.4]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={className}
        >
            <div style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }} className="relative h-full w-full">
                {children}

                {/* Glare Overlay */}
                <motion.div
                    style={{
                        background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                        opacity: 0,
                        zIndex: 50
                    }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                />

                {/* Edge Highlight (Specular) */}
                <div className="absolute inset-0 ring-1 ring-white/20 rounded-sm pointer-events-none"></div>
            </div>
        </motion.div>
    );
};

export default ThreeDTiltCard;
