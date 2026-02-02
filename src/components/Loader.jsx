import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Loader = ({ onComplete, t, lang }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // 1. Try to play with sound immediately
        video.muted = false;
        video.play()
            .then(() => {
                // Success: Audio is playing
            })
            .catch((error) => {
                console.warn("Autoplay with sound blocked. Muting and retrying.", error);
                video.muted = true;
                video.play().catch(e => console.error("Video playback failed completely", e));

                // 2. Fallback: Unmute on FIRST interaction
                const enableSound = () => {
                    video.muted = false;
                    video.volume = 1.0;
                    document.removeEventListener('click', enableSound);
                    document.removeEventListener('touchstart', enableSound);
                    document.removeEventListener('keydown', enableSound);
                };

                document.addEventListener('click', enableSound);
                document.addEventListener('touchstart', enableSound);
                document.addEventListener('keydown', enableSound);
            });
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center text-white overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 1.5, ease: "easeInOut" }
            }}
        >
            {/* Ambient Background Light (Breathing) */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[100px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 p-4 flex flex-col items-center">

                {/* Logo Video Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="mb-8 relative"
                >
                    <div className="w-40 h-40 md:w-56 md:h-56 relative flex items-center justify-center overflow-hidden rounded-xl">
                        {/* Video Layer */}
                        {/* Video Layer */}
                        <video
                            ref={videoRef}
                            src="/the%20new%20Background/freecompress-intro_ycuk3h.mp4"
                            loop
                            playsInline
                            preload="auto"
                            className="w-full h-full object-cover shadow-2xl"
                        />
                    </div>
                </motion.div>

                {/* French Style Welcome */}
                <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    className="font-bodoni text-5xl md:text-8xl text-[#F2E8C9] mb-4 tracking-wider"
                >
                    {t?.welcome || "Welcome"}
                </motion.span>

                {/* Italian Luxury Brand Name */}
                <div className="overflow-hidden px-4 py-2">
                    <motion.div
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} // Custom springy ease
                    >
                        <h1 className="text-3xl md:text-6xl font-bodoni font-normal tracking-[0.05em] text-[#D4AF37] whitespace-nowrap leading-tight">
                            IBRAHIM AL-IRAQI
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* Fine Golden Thread Progress */}
            <div className="w-64 h-[0.5px] bg-white/5 mt-10 relative overflow-hidden">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
                />
            </div>

            <motion.p
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                animate={{ opacity: 1, letterSpacing: "0.3em" }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute bottom-12 text-[10px] uppercase text-[#D4AF37]/60 font-bodoni"
            >
                Defining Luxury
            </motion.p>
        </motion.div>
    );
};

export default Loader;
