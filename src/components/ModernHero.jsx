import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';


const ModernHero = ({ t, lang }) => {
    const ref = useRef(null);
    const videoRef = useRef(null);
    const { scrollY } = useScroll();
    const yBg = useTransform(scrollY, [0, 500], [0, 200]); // Parallax effect

    // Audio Autoplay Logic (Matches Loader behavior)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Default to muted autoplay (browser policy compliant)
        video.muted = true;
        video.play().catch(e => console.warn("Video playback initialized as muted (Autoplay policy).", e));

        // Unmute on FIRST interaction
        const enableSound = () => {
            if (video.muted) {
                video.muted = false;
                video.volume = 1.0;
            }
            // Remove listeners once sound is enabled
            document.removeEventListener('click', enableSound);
            document.removeEventListener('touchstart', enableSound);
            document.removeEventListener('keydown', enableSound);
        };

        document.addEventListener('click', enableSound);
        document.addEventListener('touchstart', enableSound);
        document.addEventListener('keydown', enableSound);

        return () => {
            document.removeEventListener('click', enableSound);
            document.removeEventListener('touchstart', enableSound);
            document.removeEventListener('keydown', enableSound);
        };
    }, []);

    return (
        <section id="home" ref={ref} className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover scale-105" // Slight scale to avoid edge artifacts
                >
                    <source src="/the%20new%20Background/freecompress-$RBIU10L.mp4" type="video/mp4" />
                </video>
                {/* Overlay gradient - Reduced opacity for better video visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/10 to-black/20"></div>


            </div>

            {/* Content */}
            <div className={`relative z-10 text-center p-8 ${lang === 'ar' ? 'font-cairo' : ''}`}>

                {/* 1. Subtitle: Elegant Tracking Expansion */}
                <motion.h2
                    initial={{ opacity: 0, letterSpacing: "0em", y: 20 }}
                    animate={{ opacity: 1, letterSpacing: "0.5em", y: 0 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="text-white text-sm md:text-base uppercase mb-6"
                >
                    {t?.subtitle || "THE NEW COLLECTION"}
                </motion.h2>

                {/* 2. Main Title: Masked Slide-Up Reveal */}
                <div className="overflow-hidden mb-8 w-full px-4 py-4 md:py-6"> {/* Added vertical padding for descenders */}
                    <motion.h1
                        initial={{ y: "110%", skewY: 5 }}
                        animate={{ y: "0%", skewY: 0 }}
                        transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }} // Custom "Luxury" Bezier
                        className={`text-white text-5xl md:text-7xl lg:text-9xl font-bold drop-shadow-2xl ${lang === 'ar' ? 'font-amiri leading-normal' : 'font-serif leading-[0.9]'}`}
                    >
                        {lang === 'ar' ? 'إبراهيم العراقي' : 'IBRAHIM AL-IRAQI'}
                    </motion.h1>
                </div>

                {/* 3. Description: Fade Up with Blur */}
                <motion.p
                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="text-gray-200 text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto mb-12"
                >
                    {t?.desc || "Definitive luxury. Meticulously tailored for the modern gentleman."}
                </motion.p>

                {/* 4. CTA: Magnetic Scale Entrance */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1.6, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.05, backgroundColor: "#D4AF37", color: "#fff" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-black px-12 py-5 uppercase tracking-[0.2em] text-xs font-bold transition-all shadow-2xl hover:shadow-gold/20"
                >
                    {t?.ctaPrimary || "Discover"}
                </motion.button>
            </div>


            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 2.0 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest cursor-pointer hover:text-white transition-colors"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                {t?.scroll || "SCROLL"}
            </motion.div>
        </section>
    );
};

export default ModernHero;
