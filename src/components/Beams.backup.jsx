import React from "react";
import { motion } from "framer-motion";

const Beams = ({ className }) => {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] opacity-30">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ rotate: i * 60 }}
                        animate={{ rotate: i * 60 + 360 }}
                        transition={{
                            duration: 20 + i * 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute top-1/2 left-1/2 w-[50%] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
                        style={{
                            filter: "blur(8px)",
                        }}
                    />
                ))}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={`beam-strong-${i}`}
                        initial={{ rotate: i * 90 + 45 }}
                        animate={{ rotate: i * 90 + 45 - 360 }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute top-1/2 left-1/2 w-[60%] h-[150px] bg-gradient-to-r from-transparent via-white/5 to-transparent origin-left"
                        style={{
                            clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 60%)",
                            mixBlendMode: "screen"
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Beams;
